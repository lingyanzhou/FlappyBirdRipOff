var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner || Matter.Runner;

function Game(ele, debugEle) {
  this.loaded = false;
  this.started = false;
  this.phxEngine = Engine.create();
  World.add(this.phxEngine.world, [
    Bodies.rectangle(Game.WIDTH/2, -200, 2000, 200, {isStatic: true, collisionFilter: {group:0, category:0x4, mask: 0x1}}),
    Bodies.rectangle(Game.WIDTH/2, Game.HEIGHT+200, 2000, 200, {isStatic: true, collisionFilter: {group:0, category:0x4, mask: 0x1}}),
    Bodies.rectangle(-200, Game.HEIGHT/2, 200, 2000, {isStatic: true, collisionFilter: {group:0, category:0x4, mask: 0x1}}),
    Bodies.rectangle(Game.WIDTH+200, Game.HEIGHT/2, 200, 2000, {isStatic: true, collisionFilter: {group:0, category:0x4, mask: 0x1}})
  ]);
  if (debugEle != null) {
    this.debugRender = Render.create({
      element: document.querySelector(debugEle),
      engine: this.phxEngine,
      bounds: {
        min: { x: -200, y: -200 },
        max: { x: Game.WIDTH+200, y: Game.HEIGHT+200 }
      },
      options: {
        width: Game.WIDTH+400,
        height: Game.HEIGHT+400,
        wireframes: true,

      }
    });
    Render.run(this.debugRender);
  }

  this.app = new PIXI.Application({
    width: Game.WIDTH,
    height: Game.HEIGHT,
    autoStart: false,
    view: document.querySelector(ele),
    backgroundColor: '#ffffff'
  });

  Bird.requestResources(this.app.loader);
  Wall.requestResources(this.app.loader);
  Sky.requestResources(this.app.loader);

  this.stage = this.app.stage;
  this.backgroundContainer = new PIXI.Container();
  this.unitContainer = new PIXI.Container();
  this.messageContainer = new PIXI.Container();
  this.stage.addChild(this.backgroundContainer);
  this.stage.addChild(this.unitContainer);
  this.stage.addChild(this.messageContainer);
  this.unitRegister = [];
  this.backgroundRegister = [];
  this.messageRegister = [];
  this.customMovementRegister = [];
  this.score = 0;
  this.sky0 = null;
  this.sky1 = null;

  this.bird = null;
  this.wallRegister = [];
  this.loadingMessage = new Message(this.phxEngine, this.messageContainer, [this.messageRegister], 'Loading...',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
  this.startMessage = new Message(this.phxEngine, this.messageContainer, [this.messageRegister], 'Press Any Key to Start',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
  this.scoreMessage = new Message(this.phxEngine, this.messageContainer, [this.messageRegister], 'Score = ',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
  this.app.ticker.add(this.tickNonGame, this);
  this.app.ticker.start();
  this.nextBarFrame = 0;
  this.frameSinceLastBar =0;

  this.app.loader.load(function(loader, resources) {
    Bird.onResourceLoaded(loader, resources);
    Wall.onResourceLoaded(loader, resources);
    Sky.onResourceLoaded(loader, resources);
    this.loaded = true;
    this.drawStartPage();
  }.bind(this))
  this.setUpControls(ele);
  this.drawLoadingPage();
}

Game.WALL_WIDTH = 60;
Game.WALL_HEIGHT = 800;
Game.BIRD_WIDTH = 60;
Game.BIRD_HEIGHT = 40;
Game.WIDTH = 800;
Game.HEIGHT = 400;
Game.BIRDINITPOS = {x: 60, y: 100};
Game.WALL_MOVE = function (dt, phxObj) {
  phxObj.position.x -= dt;
};
Game.SKY_MOVE = function (dt, phxObj) {
  phxObj.position.x -= dt/2;
};

Game.prototype.wallOpeningSize = function () {
  return Math.round(Math.random()*Game.BIRD_HEIGHT*2+Game.BIRD_HEIGHT*2.5);
}

Game.prototype.wallOpeningHeight = function () {
  return Math.round(Math.random()*(Game.HEIGHT-4*Game.BIRD_HEIGHT)+2*Game.BIRD_HEIGHT);
}

Game.prototype.makeWallPair = function () {
  var openingSize = this.wallOpeningSize();
  var openingHeight = this.wallOpeningHeight();
  var w1 = new Wall(this.phxEngine, this.unitContainer, [this.wallRegister, this.unitRegister], this.customMovementRegister, Game.WALL_WIDTH, Game.WALL_HEIGHT);
  var w2 = new Wall(this.phxEngine, this.unitContainer, [this.wallRegister, this.unitRegister], this.customMovementRegister, Game.WALL_WIDTH, Game.WALL_HEIGHT);

  w1.customMovement = new CustomMovement(w1.phxObj, function (dt, phxObj) {
    Body.setPosition(phxObj, {x: phxObj.position.x-dt, y: phxObj.position.y});
  });
  w2.customMovement = new CustomMovement(w2.phxObj, function (dt, phxObj) {
    Body.setPosition(phxObj, {x: phxObj.position.x-dt, y: phxObj.position.y});
  });
  Body.setPosition(w1.phxObj, {x:Game.WIDTH + Game.WALL_WIDTH/2, y: openingHeight - openingSize/2 - Game.WALL_HEIGHT/2});
  Body.setPosition(w2.phxObj, {x:Game.WIDTH + Game.WALL_WIDTH/2, y: openingHeight + openingSize/2 + Game.WALL_HEIGHT/2});

  w1.register();
  w2.register();
  return [w1, w2]
}

Game.prototype.setUpControls= function (ele) {
  $(ele).click(function () {
    game.onClick();
  });
  $(window).keydown(function (e) {
    if (e.which === 32) {
      game.onClick();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.which === 27) {
      game.endGame();
      e.stopPropagation();
      e.preventDefault();
    }
  });
}

Game.prototype.drawLoadingPage = function () {
  if (this.loaded) {
    return;
  }
  this.clearStage();
  this.backgroundContainer.visible = false;
  this.unitContainer.visible = false;
  this.messageContainer.visible = true;
  this.loadingMessage.register();
}

Game.prototype.drawStartPage = function () {
  if (!this.loaded || this.started) {
    return;
  }
  this.clearStage();
  this.sky0 = this.sky0 || new Sky(this.phxEngine, this.backgroundContainer, [this.backgroundRegister], null, 2*Game.WIDTH, Game.HEIGHT);
  this.sky0.customMovement = null;
  Body.setPosition(this.sky0.phxObj, {x:Game.WIDTH, y: Game.HEIGHT/2});
  this.backgroundContainer.visible = true;
  this.unitContainer.visible = false;
  this.messageContainer.visible = true;
  this.startMessage.register();
  this.sky0.register();
}

Game.prototype.onClick = function () {
  if (!this.loaded) {
    return;
  }
  if (this.started) {
    this.flap();
  } else {
    this.start();
  }
}

Game.prototype.start = function () {
  if (!this.loaded || this.started) {
    return;
  }
  this.started = true;
  this.initGame();

  Events.on(this.phxEngine, 'collisionStart', function(event) {
    this.endGame();
  }.bind(this));
};

Game.prototype.clearStage = function () {
  if (!this.loaded) {
    return;
  }
  for (var o of this.unitRegister.slice()) {
    o.unregister();
  }
  for (var o of this.messageRegister.slice()) {
    o.unregister();
  }
  for (var o of this.backgroundRegister.slice()) {
    o.unregister();
  }
  this.messageContainer.visible = false;
  this.unitContainer.visible = false;
  this.backgroundContainer.visible = false;
};

Game.prototype.initGame = function () {
  this.nextBarFrame= 0;
  this.frameSinceLastBar = 0;
  this.app.ticker.remove(this.tickNonGame, this);
  this.app.ticker.add(this.tickGame, this);
  this.app.ticker.start();
  this.clearStage();
  this.score = 0;
  this.bird = this.bird || new Bird(this.phxEngine, this.unitContainer, [this.unitRegister], this.customMovementRegister, Game.BIRD_WIDTH, Game.BIRD_HEIGHT);
  this.bird.customMovement = this.bird.customMovement || new CustomMovement(this.bird.phxObj, function (dt, phxObj) {
    Body.setAngle(phxObj, Math.atan2(phxObj.velocity.y, phxObj.velocity.x+4));
  });

  this.sky1 = this.sky1 || new Sky(this.phxEngine, this.backgroundContainer, [this.backgroundRegister], this.customMovementRegister, 2*Game.WIDTH, Game.HEIGHT);
  this.sky1.customMovement = this.sky1.customMovement || new CustomMovement(this.sky1.phxObj, function (dt, phxObj) {
    var newX = phxObj.position.x -= dt/2;
    if (newX<=0) {
      Body.setPosition(phxObj, {x: Game.WIDTH, y: phxObj.position.y});
    } else {
      Body.setPosition(phxObj, {x: phxObj.position.x-dt/2, y: phxObj.position.y});
    }
  });

  Body.setPosition(this.sky1.phxObj, {x:Game.WIDTH, y: Game.HEIGHT/2});
  Body.setPosition(this.bird.phxObj, Game.BIRDINITPOS);
  Body.setVelocity(this.bird.phxObj, {x: 0, y: 0});
  this.messageContainer.visible = true;
  this.unitContainer.visible = true;
  this.backgroundContainer.visible = true;
  this.scoreMessage.register();
  this.bird.register();
  this.sky1.register();
};

Game.prototype.flap = function () {
  if (!this.started) {
    return;
  }
  this.bird.flap();
};

Game.prototype.tickGame = function (dt) {
  this.score += dt;
  this.scoreMessage.sprite.text='Score = ' + Math.round(this.score);

  for (var c of this.customMovementRegister) {
    c.tick(dt);
  }

  this.frameSinceLastBar += 1;
  if (this.nextBarFrame<=this.frameSinceLastBar) {
    this.makeWallPair();
    this.nextBarFrame = Math.round(Math.random()*200+200);
    this.frameSinceLastBar = 0;
  }

  for (var w of this.wallRegister.slice()) {
    if (w.phxObj.position.x < -Game.WALL_WIDTH) {
      w.unregister();
    }
  }

  for (var o of this.unitRegister) {
    o.updateView(dt);
  }
  for (var o of this.backgroundRegister) {
    o.updateView(dt);
  }
  for (var o of this.messageRegister) {
    o.updateView(dt);
  }

  Engine.update(this.phxEngine,  this.app.elapsedMS);
  this.app.renderer.render(this.app.stage);
};

Game.prototype.tickNonGame = function (dt) {
  for (var c of this.customMovementRegister) {
    c.tick(dt);
  }

  for (var o of this.unitRegister) {
    o.updateView(dt);
  }
  for (var o of this.backgroundRegister) {
    o.updateView(dt);
  }
  for (var o of this.messageRegister) {
    o.updateView(dt);
  }
  this.app.renderer.render(this.app.stage);
};

Game.prototype.endGame = function () {
  this.score = 0;
  this.started = false;
  this.app.ticker.remove(this.tickGame, this);
  this.app.ticker.add(this.tickNonGame, this);
  this.app.ticker.start();
  this.drawStartPage();
};
