var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Sky(phxEngine, stage, objRegisters, customMovementRegister, width, height) {
  GameObject.call(this, phxEngine, stage, objRegisters, customMovementRegister);
  this.phxObj = Bodies.rectangle(0, 0, width, height, {
    isStatic: true,
    collisionFilter: {
      mask: 0x0
    }
  });
  this.sprite.texture = Sky.TEXTURES[0];
  this.sprite.anchor.set(0.5, 0.5);
  this.sprite.width = width;
  this.sprite.height = height;

  this.customMovement = null;
}
Sky.prototype = Object.create(GameObject.prototype);

Sky.SPRITEFILES = ['img/sky.png'];
Sky.SPRITESID = ['sky'];
Sky.TEXTURES = [];

Sky.requestResources = function (loader) {
  for (var i = 0; i< Sky.SPRITESID.length; i++) {
    loader.add(Sky.SPRITESID[i], Sky.SPRITEFILES[i]);
  }
}

Sky.onResourceLoaded = function (loader, resources) {
  Sky.TEXTURES = [];
  for (var i = 0; i< Sky.SPRITESID.length; i++) {
    Sky.TEXTURES[i] = resources[Sky.SPRITESID[i]].texture;
  }
}

Sky.prototype.updateView = function () {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
}
