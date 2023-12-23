// Canvas for Cars
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Canvas for Neural Net
const netCanvas = document.getElementById("netCanvas");
netCanvas.width = 400;

// Declaring Neural Net and Road Contexts
const context = canvas.getContext("2d");
const netContext = netCanvas.getContext("2d");

// Getting road and generated cars
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const generatedCars = 500;
const cars = generateCars(generatedCars);
const carYStart = 100;
let runNum = 1;

// Getting stored data from previous run if it exists, or else initalize to inital value
let runData = {x: [], y: []};
if (localStorage.getItem("runData")) {
    runData = JSON.parse(localStorage.getItem("runData"));
}
let lastRunScore = 0;
if (localStorage.getItem("lastRunScore")) {
    lastRunScore = JSON.parse(localStorage.getItem("lastRunScore"));
}

const damagedDistanceThreshold = 150.0; // Must be a float
let play = true;
let optimalCar = cars[0];
let bestScore = 0;
if (localStorage.getItem("bestScore")) {
    bestScore = JSON.parse(localStorage.getItem("bestScore"));
}
if (localStorage.getItem("bestCar")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestCar"));
        if (i != 0) { NeuralNet.mutate(cars[i].brain, 0.1); }
    }
}

// Array of all cars in training set
const carTraffic = [
    /*
    0 = Left Lane
    1 = Center Lane
    2 = Right Lane
    */

    // Traffic Line 1: 0
    new Car(road.getLaneCenter(0), -100, 30, 50, "TRAFFIC", 0),

    // Traffic Line 2: 1
    new Car(road.getLaneCenter(1), -300, 30, 50, "TRAFFIC", 0),

    // Traffic Line 3: 2
    new Car(road.getLaneCenter(2), -500, 30, 50, "TRAFFIC", 0),

    // Traffic Line 4: 1, 2
    new Car(road.getLaneCenter(1), -700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -700, 30, 50, "TRAFFIC", 0),

    // Traffic Line 5: 0, 1
    new Car(road.getLaneCenter(0), -900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -900, 30, 50, "TRAFFIC", 0),

    // Traffic Line 6: 2
    new Car(road.getLaneCenter(2), -1100, 30, 50, "TRAFFIC", 0),

    // Traffic Line 7: 1, 2
    new Car(road.getLaneCenter(1), -1300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -1300, 30, 50, "TRAFFIC", 0),

    // Traffic Line 8: 0, 2
    new Car(road.getLaneCenter(0), -1500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -1500, 30, 50, "TRAFFIC", 0),

    // Traffic Line 9: 1, 2
    new Car(road.getLaneCenter(1), -1700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -1700, 30, 50, "TRAFFIC", 0),

    // Traffic Line 10: 0
    new Car(road.getLaneCenter(0), -1900, 30, 50, "TRAFFIC", 0),

    // Traffic Line 11: 0, 1
    new Car(road.getLaneCenter(0), -2100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -2100, 30, 50, "TRAFFIC", 0),

    // Traffic Line 12: 0, 2
    new Car(road.getLaneCenter(0), -2300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -2300, 30, 50, "TRAFFIC", 0),

    // Traffic Line 13: 1, 2
    new Car(road.getLaneCenter(1), -2500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -2500, 30, 50, "TRAFFIC", 0),

    // Traffic Line 14: 0, 1
    new Car(road.getLaneCenter(0), -2700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -2700, 30, 50, "TRAFFIC", 0),

    // Traffic Line 15: 1
    new Car(road.getLaneCenter(1), -2900, 30, 50, "TRAFFIC", 0),

    // Traffic Line 16: 0, 1
    new Car(road.getLaneCenter(1), -3100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -3100, 30, 50, "TRAFFIC", 0),

    // Traffic Line 17: 1, 2
    new Car(road.getLaneCenter(1), -3300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -3300, 30, 50, "TRAFFIC", 0),

    // Traffic Line 18: 0, 2
    new Car(road.getLaneCenter(0), -3500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -3500, 30, 50, "TRAFFIC", 0),

    // Traffic Line 19: 1, 2
    new Car(road.getLaneCenter(1), -3700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -3700, 30, 50, "TRAFFIC", 0),

    // Traffic Line 20: 0, 1
    new Car(road.getLaneCenter(0), -3900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -3900, 30, 50, "TRAFFIC", 0)
]

// Let the action begin...
if (lastRunScore == 0) { Chart.drawChart(runData); }
animate();

function animate(time) {
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, road.finishLine, carTraffic);
    }
    optimalCar = cars.find(c => c.y == (Math.min(...cars.map(c => c.y))) );
    saveLastRun(runData);

    canvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    context.save();
    context.translate(0, -optimalCar.y + canvas.height * 0.8);
    road.draw(context);
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].draw(context, "red");
    }
    context.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(context, "blue");
    }
    context.globalAlpha = 1;
    optimalCar.draw(context, "blue", true);
    
    let notDamagedCarsWithinThreshold = false;
    for (let i = 0; i < cars.length; i++) {
        if (!cars[i].damaged && totalDistance(optimalCar.x, optimalCar.y, cars[i].x, cars[i].y) <= damagedDistanceThreshold) { 
            notDamagedCarsWithinThreshold = true; 
            if (cars[i].lastY <= cars[i].y) {
                cars[i].carProgressLives--;
            }
        }
    }

    if ((optimalCar.damaged && !notDamagedCarsWithinThreshold) || optimalCar.finished) {
        saveBestCar();
    }

    context.restore();

    netContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netContext, optimalCar.brain);
    if (play) {
        requestAnimationFrame(animate);
    }
}
