// Canvas for Cars
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Canvas for Neural Net
const netCanvas = document.getElementById("netCanvas");
netCanvas.width = 400;

const context = canvas.getContext("2d");
const netContext = netCanvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const generatedCars = 700;
const cars = generateCars(generatedCars);

const damagedDistanceThreshold = 100.0; // Must be a float
let play = true;
let optimalCar = cars[0];
let bestScore = 0;
if (localStorage.getItem("bestScore")) {
    bestScore = JSON.parse(localStorage.getItem("bestScore"));
}
if (localStorage.getItem("bestCar")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestCar"));
        if (i != 0) { NeuralNet.mutate(cars[i].brain, 0.2); }
    }
}

const carTraffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -1100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -1100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -1300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -1300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -1500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -1700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -1900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -1900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -2100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -2300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -2300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -2500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -2700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -2700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -2900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -2900, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -3100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -3100, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -3300, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(2), -3500, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(0), -3700, 30, 50, "TRAFFIC", 0),
    new Car(road.getLaneCenter(1), -3900, 30, 50, "TRAFFIC", 0)
]

animate();

function saveBestCar() {
    const optimalCarScore = score(optimalCar, carTraffic);
    if (optimalCarScore >= bestScore) {
        localStorage.setItem("bestCar", JSON.stringify(optimalCar.brain));
        localStorage.setItem("bestScore", JSON.stringify(optimalCarScore));
    }
    if (!optimalCar.finished) { location.reload(); }
    else { play = false; }
}

function deleteBestCar() {
    localStorage.removeItem("bestCar");
    localStorage.removeItem("bestScore");
    location.reload();
}

function startPause() { 
    if (!play) {
        play = true; 
        animate();
    } else {
        play = false;
    }
}

function generateCars(n) {
    const cars = [];
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, road.finishLine, carTraffic);
    }
    optimalCar = cars.find(c => c.y == (Math.min(...cars.map(c => c.y))) );

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