// Canvas for Cars
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Canvas for Neural Net
const netCanvas = document.getElementById("netCanvas");
netCanvas.width = 400;

// Declaring Neural Net and Road Contexts
const context = canvas.getContext("2d");
const netContext = netCanvas.getContext("2d");

const carYStart = 100;
const trafficCarDistance = 300;
const finish = -(carYStart - (21 * trafficCarDistance));
const road = new Road(canvas.width / 2, canvas.width * 0.9);
let play = true;

bestCar = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3);
bestCar.brain = JSON.parse(bestBrain);

carTraffic = generateTraffic();

function testAnimate(time) {
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }

    bestCar.update(road.borders, road.finishLine, carTraffic);

    canvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    context.save();
    context.translate(0, -bestCar.y + canvas.height * 0.8);
    road.draw(context);
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].draw(context, "red");
    }

    bestCar.draw(context, "blue", true);

    context.restore();

    netContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netContext, optimalCar.brain);
    if (play) {
        requestAnimationFrame(testAnimate);
    }
}