var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Wall(phxEngine, stage, objRegisters, customMovementRegister, width, height) {
  GameObject.call(this, phxEngine, stage, objRegisters, customMovementRegister);
  this.phxObj = Bodies.rectangle(-1000, 0, width, height, {
    isStatic: true,
    collisionFilter: {
      category: 0x2,
      mask: 0x1
    },
    render: {
      fillStyle: '#777777'
    }
  });
  this.sprite.texture = Wall.TEXTURES[0];
  this.sprite.anchor.set(0.5, 0.5);
  this.sprite.width = width;
  this.sprite.height = height;

  this.customMovement = null;
}
Wall.prototype = Object.create(GameObject.prototype);

Wall.SPRITEFILES = ['img/pipe.png'];
Wall.SPRITESID = ['pipe'];
Wall.TEXTURES = [];

Wall.requestResources = function (loader) {
  for (var i = 0; i< Wall.SPRITESID.length; i++) {
    loader.add(Wall.SPRITESID[i], Wall.SPRITEFILES[i]);
  }
}

Wall.onResourceLoaded = function (loader, resources) {
  Wall.TEXTURES = [];
  for (var i = 0; i< Wall.SPRITESID.length; i++) {
    Wall.TEXTURES[i] = resources[Wall.SPRITESID[i]].texture;
  }
}

Wall.prototype.updateView = function () {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
}
