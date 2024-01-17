// Canvas for Cars
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Canvas for Neural Net
const netCanvas = document.getElementById("netCanvas");
netCanvas.width = 400;

// Declaring Neural Net and Road Contexts
const context = canvas.getContext("2d");
const netContext = netCanvas.getContext("2d");

// Defining
const carYStart = 100;
const trafficCarDistance = 300;
const finish = -(carYStart - (21 * trafficCarDistance));
const road = new Road(canvas.width / 2, canvas.width * 0.9);
let play = true;

// Constructing the car and its brain (NeuralNet)
bestCar = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3);
bestCar.brain = reconstructBrain(bestBrain, bestCar.sensors.rayCount);

const carTraffic = generateTraffic();
console.log(bestCar.brain);
testAnimate();

function testAnimate(time) {

    // Update all car positions
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }

    bestCar.update(road.borders, road.finishLine, carTraffic);

    canvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    // Draw everything
    context.save();
    context.translate(0, -bestCar.y + canvas.height * 0.8);
    road.draw(context);
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].draw(context, "red");
    }
    bestCar.draw(context, "blue", true);

    context.restore();

    // Draw Neural Net visualization and call testAnimate again if play = true
    netContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netContext, bestCar.brain);
    if (play) {
        requestAnimationFrame(testAnimate);
    }
}