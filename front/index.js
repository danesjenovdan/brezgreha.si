const engine = Matter.Engine.create();

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = Matter.Render.create({
    element: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#2c2e35',
    },
});

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const bottomWall = Matter.Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 10, {
    isStatic: true
});
const rightWall = Matter.Bodies.rectangle(canvas.width, canvas.height / 2, 10, canvas.height, {
    isStatic: true
});
const topWall = Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 10, {
    isStatic: true
});
const leftWall = Matter.Bodies.rectangle(0, canvas.height / 2, 10, canvas.height, {
    isStatic: true
});

const virtualniVizjak = Matter.Bodies.rectangle(400, 200, 200, 200, {
    isStatic: true,
    render: {
        sprite: {
            texture: `img/v${Math.ceil(Math.random() * 3)}r.png`,
            xScale: 1,
            yScale: 1,
        },
    },
});

function createKamen(image) {
    const kamen = Matter.Bodies.circle(canvas.width / 2, canvas.height - 320, 25, {
        render: {
            sprite: {
                texture: image,
                xScale: 0.1,
                yScale: 0.1,
            },
            visible: true,
        },
        collisionFilter: {
            category: 3,
        },
    });
    return kamen;
}
let kamen;  

function createMouse() {
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            render: {
                visible: false
            }
        },
        collisionFilter: {
            group: -1,
        },
    });
    render.mouse = mouse;
    return mouseConstraint;
}
const mouseConstraint = createMouse();

Matter.World.add(engine.world, [virtualniVizjak, bottomWall, rightWall, topWall, leftWall, mouseConstraint]);
Matter.Runner.run(engine);
Matter.Render.run(render);

let hit = false;

function didVirtualniVizjakAndKamenCollide(pairsList) {
    let foundPair = false;
    
    pairsList.forEach((pair) => {
        foundPair = pair.id.includes(kamen.id.toString()) && pair.id.includes(virtualniVizjak.id.toString());
        if (foundPair) {
            return;
        }
    })
    return foundPair;
}

const limitMaxSpeed = () => {
    let maxSpeed = 25;
    if (kamen.velocity.x > maxSpeed) {
        Matter.Body.setVelocity(kamen, { x: maxSpeed, y: kamen.velocity.y });
    }

    if (kamen.velocity.x < -maxSpeed) {
        Matter.Body.setVelocity(kamen, { x: -maxSpeed, y: kamen.velocity.y });
    }

    if (kamen.velocity.y > maxSpeed) {
        Matter.Body.setVelocity(kamen, { x: kamen.velocity.x, y: maxSpeed });
    }

    if (kamen.velocity.y < -maxSpeed) {
        Matter.Body.setVelocity(kamen, { x: -kamen.velocity.x, y: -maxSpeed });
    }
}

Matter.Events.on(engine, 'beforeUpdate', limitMaxSpeed);

let animateVirtualniVizjak = false;
const animationInterval = window.setInterval(() => {
    animateVirtualniVizjak = !animateVirtualniVizjak;
}, 500);

Matter.Events.on(engine, 'beforeUpdate', function(event) {
    if (!hit) {
        var px = (canvas.width / 2) + Math.min((canvas.width / 2 - 130), 300) * Math.sin(engine.timing.timestamp * 0.001);
        Matter.Body.setVelocity(virtualniVizjak, { x: px - virtualniVizjak.position.x, y: 0 });
        Matter.Body.setPosition(virtualniVizjak, { x: px, y: 200 });
    }
});

Matter.Events.on(engine, "afterUpdate", function(event) {
    if (event.source.pairs.list.length > 0) {
        if (didVirtualniVizjakAndKamenCollide(event.source.pairs.list) && !hit) {
            hit = true;
            fetch('https://counter.lb.djnd.si/', {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('counter-number').innerText = ` ${data.kamnov} `;
                document.getElementById('counter').style.visibility = 'visible';
            });;
            kamen.collisionFilter.group = -1;
            Matter.Composite.remove(engine.world, kamen);
            kamen.render.sprite.texture = `img/k${Math.ceil(Math.random() * 10)}.png`;
            Matter.Body.setVelocity(kamen, { x: 0, y: 0 });
            virtualniVizjak.render.sprite.texture = `img/vz${Math.ceil(Math.random() * 11)}r.png`;
            window.setTimeout(() => {
                virtualniVizjak.render.sprite.texture = `img/v${Math.ceil(Math.random() * 3)}r.png`;
                Matter.Body.setPosition(kamen, { x: canvas.width / 2, y: canvas.height - 120, });
                Matter.World.add(engine.world, [kamen]);
                kamen.collisionFilter.group = 1;
                hit = false;
            }, 2500);
        }
    };
});

function startGame() {
    document.getElementById('overlay').style.top = '-200vh';
    window.setTimeout(() => {
        kamen = createKamen(`img/k${Math.ceil(Math.random() * 10)}.png`);
        Matter.World.add(engine.world, [kamen]);
    }, 200);
}
