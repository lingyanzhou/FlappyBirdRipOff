var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

const WIDTH = 800,
  HEIGHT = 400,
  BOXWIDTH = 40,
  BOXHEIGHT = 40,
  BOXPOSX = 60,
  GROUNDBOUNCE = 0.8,
  BARWIDTH = 20;

function FloppyBirdRipOff() {

}

function scaleHeight(h) {
  return h*(HEIGHT-2*BOXHEIGHT)+BOXHEIGHT;
}

function scaleHole(size) {
  return size*70+100;
}
function scaleBarWidth(w) {
  return w*BARWIDTH+BARWIDTH;
}

function calcNextBarT(t) {
  return Math.ceil(t + Math.random()*140+70);
}

var engine = Engine.create();

var render = Render.create({
  element: document.getElementById("game"),
  engine: engine,
  options: {
    width: WIDTH,
    height: HEIGHT,
    wireframes: false
  }
});

var runner = Runner.create();

engine.world.gravity.y = 1;

var bird = Bodies.rectangle(BOXPOSX, 40, BOXWIDTH, BOXHEIGHT, {
  mass: 5,
  frictionAir: 0.05,
  inverseMass: 0.2,
  collisionFilter: {
    mask: 1
  },
  render: {
    fillStyle: '#ffffff'
  }
});
var bars = makeBarPair(0);
var t = 0;
var nextBarT = 0;

World.add(engine.world, [bird].concat(bars));
bird.mass = 5;
bird.inverseMass = 0.2;


Events.on(engine, "afterUpdate", function() {
  var barsRemain = [];
  for (var b of bars) {
    Body.setPosition(b, {x:b.position.x-2, y:b.position.y});
    if (b.position.x > -500) {
      barsRemain.push(b);
    } else {
      Matter.Composite.remove(engine.world, b);
    }
  }
  var newBars = [];
  if (t>=nextBarT) {
    nextBarT = calcNextBarT(t);
    newBars = makeBarPair(t);
    World.add(engine.world, newBars);
  }
  bars = barsRemain.concat(newBars);
  t += 1;

  if (bird.position.y < 0+BOXWIDTH/2) {
    Body.setPosition(bird, {x:BOXPOSX, y:BOXWIDTH/2})
    Body.setVelocity(bird, {x:0, y:-bird.velocity.y*COLLISIONDAMP})
  } else if (bird.position.y > HEIGHT-BOXHEIGHT/2) {
    Body.setPosition(bird, {x:BOXPOSX, y:HEIGHT-BOXHEIGHT/2})
    Body.setVelocity(bird, {x:0, y:-bird.velocity.y*COLLISIONDAMP})
  }
})

// an example of using collisionStart event on an engine
Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    // change object colours to show those starting a collision
    for (var b of bars) {
      Matter.Composite.remove(engine.world, b);
    }
    bars = [];

    Body.setPosition(bird, {x:BOXPOSX, y:HEIGHT/2-BOXHEIGHT/2})
    Body.setVelocity(bird, {x:0, y:0})

    runner.enabled = false;
});

Runner.run(runner, engine);
runner.enabled = false;

Render.run(render);

var prevHight=0.5;

function makeBarPair(t) {
  prevHight = Math.max(Math.min(prevHight + Math.random()*0.5-0.25, 1), 0)
  var opening = scaleHeight(prevHight);
  var hole = scaleHole(Math.random());
  var barwidth = scaleBarWidth(Math.random());
  var b1 = Bodies.rectangle(WIDTH, opening+hole/2+HEIGHT/2, barwidth, HEIGHT, {
    isStatic: true,
    collisionFilter: {
      mask: 1
    },
    render: {
      fillStyle: '#00ff00'
    }
  });
  var b2 = Bodies.rectangle(WIDTH, opening-hole/2-HEIGHT/2, barwidth, HEIGHT, {
    isStatic: true,
    collisionFilter: {
      mask: 1
    },
    render: {
      fillStyle: '#00ff00'
    }
  });
  return [b1, b2];
}

$(render.canvas).click(function () {
    Body.applyForce(bird, bird.position, {x:0, y:-0.12});
});

$('#start').click(function () {
    runner.enabled = true;
});

$('#stop').click(function () {
    runner.enabled = false;
});
