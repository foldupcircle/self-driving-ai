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
const carYStart = 100;
const trafficCarDistance = 300;
const finish = -(carYStart - (21 * trafficCarDistance));
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const generatedCars = 500;
const cars = generateCars(generatedCars);

// Getting stored data from previous run if it exists, or else initalize to inital value
let runData = {x: [], y: []};
if (localStorage.getItem("runData")) {
    runData = JSON.parse(localStorage.getItem("runData"));
}
let lastRunScore = 0;
if (localStorage.getItem("lastRunScore")) {
    lastRunScore = JSON.parse(localStorage.getItem("lastRunScore"));
}

// Initializing values for best car and score
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
    For road.getLanCenter(x)
    x = 0 => Left Lane
    x = 1 => Center Lane
    x = 2 => Right Lane
    */

    // Traffic Line 1: 0
    new Car(road.getLaneCenter(0), carYStart - (trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 2: 1
    new Car(road.getLaneCenter(1), carYStart - (2 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 3: 2
    new Car(road.getLaneCenter(2), carYStart - (3 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 4: 1, 2
    new Car(road.getLaneCenter(1), carYStart - (4 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (4 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 5: 0, 1
    new Car(road.getLaneCenter(0), carYStart - (5 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), carYStart - (5 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 6: 2
    new Car(road.getLaneCenter(2), carYStart - (6 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 7: 1, 2
    new Car(road.getLaneCenter(1), carYStart - (7 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (7 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 8: 0, 2
    new Car(road.getLaneCenter(0), carYStart - (8 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (8 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 9: 1, 2
    new Car(road.getLaneCenter(1), carYStart - (9 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (9 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 10: 0
    new Car(road.getLaneCenter(0), carYStart - (10 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 11: 0, 1
    new Car(road.getLaneCenter(0), carYStart - (11 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), carYStart - (11 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 12: 0, 2
    new Car(road.getLaneCenter(0), carYStart - (12 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (12 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 13: 1, 2
    new Car(road.getLaneCenter(1), carYStart - (13 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (13 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 14: 0, 1
    new Car(road.getLaneCenter(0), carYStart - (14 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), carYStart - (14 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 15: 1
    new Car(road.getLaneCenter(1), carYStart - (15 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 16: 0, 1
    new Car(road.getLaneCenter(1), carYStart - (16 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (16 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 17: 1, 2
    new Car(road.getLaneCenter(1), carYStart - (17 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (17 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 18: 0, 2
    new Car(road.getLaneCenter(0), carYStart - (18 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (18 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 19: 1, 2
    new Car(road.getLaneCenter(1), carYStart - (19 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), carYStart - (19 * trafficCarDistance), 30, 50, "TRAFFIC", 0),

    // Traffic Line 20: 0, 1
    new Car(road.getLaneCenter(0), carYStart - (20 * trafficCarDistance), 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), carYStart - (20 * trafficCarDistance), 30, 50, "TRAFFIC", 0)
]

// Let the action begin...
if (lastRunScore == 0) { Chart.drawChart(runData); } // Draws chart of training
animate();

function animate(time) {
    /*
    Main function that animates and calls everything that needs to be run
    */

    // Updating traffic and training cars 
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, road.finishLine, carTraffic);
    }

    // Find the optimal car (car that's the furthest)
    optimalCar = cars.find(c => c.y == (Math.min(...cars.map(c => c.y))) );
    saveLastRun(runData);

    canvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    // Draw everything to be displayed
    context.save();
    context.translate(0, -optimalCar.y + canvas.height * 0.8);
    road.draw(context);
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].draw(context, "red");
    }
    context.globalAlpha = 0.2; // Transparency variable
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(context, "blue");
    }
    context.globalAlpha = 1;
    optimalCar.draw(context, "blue", true);
    
    // Allows lagging cars to continue past the optimal car if within 
    // damagedDistanceThreshold and until carProgressLives runs out
    let notDamagedCarsWithinThreshold = false;
    for (let i = 0; i < cars.length; i++) {
        if (!cars[i].damaged && totalDistance(optimalCar.x, optimalCar.y, cars[i].x, cars[i].y) <= damagedDistanceThreshold) { 
            notDamagedCarsWithinThreshold = true; 
            if (cars[i].lastY <= cars[i].y) {
                cars[i].carProgressLives--;
            }
        }
    }

    // If run is over
    if ((optimalCar.damaged && !notDamagedCarsWithinThreshold) || optimalCar.finished) {
        saveBestCar();
    }

    context.restore();

    // Draw network and call animate again if play = true
    netContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netContext, optimalCar.brain);
    if (play) {
        requestAnimationFrame(animate);
    }
}
