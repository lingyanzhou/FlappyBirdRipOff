var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Bird(phxEngine, stage, objRegisters, customMovementRegister, width, height) {
  GameObject.call(this, phxEngine, stage, objRegisters, customMovementRegister);
  this.phxObj = Bodies.rectangle(-1000, 0, width, height, {
    mass: 5,
    frictionAir: 0.05,
    inverseMass: 0.2,
    inertia:Infinity,
    inverseInertia:0,
    collisionFilter: {
      category: 0x1,
      mask: 0x2 + 0x4
    },
    render: {
      fillStyle: '#777777'
    }
  });
  this.textureIndex = 0;
  this.sprite.texture = Bird.TEXTURES[this.textureIndex];
  this.sprite.width = width;
  this.sprite.height = height;
  this.sprite.anchor.set(0.5, 0.5);
  this.animationTime = 0;
}
Bird.prototype = Object.create(GameObject.prototype);

Bird.ANIMATION_SPEED = 15;
Bird.SPRITEFILES = ['img/bird_1.png', 'img/bird_2.png', 'img/bird_3.png', 'img/bird_4.png'];
Bird.SPRITESID = ['bird_1', 'bird_2', 'bird_3', 'bird_4'];
Bird.TEXTURES = null;

Bird.requestResources = function (loader) {
  for (var i = 0; i< Bird.SPRITESID.length; i++) {
    loader.add(Bird.SPRITESID[i], Bird.SPRITEFILES[i]);
  }
}

Bird.onResourceLoaded = function (loader, resources) {
  Bird.TEXTURES = [];
  for (var i = 0; i< Bird.SPRITESID.length; i++) {
    Bird.TEXTURES[i] = resources[Bird.SPRITESID[i]].texture;
  }
}

Bird.prototype.updateTextureIndex = function () {
  this.textureIndex = (this.textureIndex + 1) % Bird.TEXTURES.length;
}

Bird.prototype.reset = function () {
  this.textureIndex = 0;
}

Bird.prototype.flap = function () {
  this.textureIndex = 2;
  Body.applyForce(this.phxObj, this.phxObj.position, {x:0, y:-0.12});
}

Bird.prototype.updateView = function (dt) {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
  this.sprite. rotation = this.phxObj.angle;
  this.animationTime += dt;
  if (this.animationTime >= Bird.ANIMATION_SPEED) {
    this.animationTime %= Bird.ANIMATION_SPEED;
    this.updateTextureIndex();
  }
  this.sprite.texture = Bird.TEXTURES[this.textureIndex];
}
