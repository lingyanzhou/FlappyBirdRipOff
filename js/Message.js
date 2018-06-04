var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Message(phxEngine, stage, objRegister, text, option) {
  GameObject.call(this, phxEngine, stage, objRegister, null);
  this.phxObj = Bodies.rectangle(0, 0, 0, 0, {
    isStatic: true,
    collisionFilter: {
      mask: 0x0
    }
  });
  this.sprite = new PIXI.Text(text, option);
  this.sprite.anchor.set(0, 0);
}
Message.prototype = Object.create(GameObject.prototype);

Message.prototype.updateView = function () {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
}
