// Canvas for Cars
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Canvas for Neural Net
const netCanvas = document.getElementById("netCanvas");
netCanvas.width = 400;

const context = canvas.getContext("2d");
const netContext = netCanvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const generatedCars = 200;
const cars = generateCars(generatedCars);

const damagedThreshold = 0.4; // [0, 1]
let play = true;
let optimalCar = cars[0];
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
    new Car(road.getLaneCenter(2), -700, 30, 50, "TRAFFIC", 0)
]

animate();

function saveBestCar() {
    localStorage.setItem("bestCar", JSON.stringify(optimalCar.brain));
}

function deleteBestCar() {
    localStorage.removeItem("bestCar");
    location.reload(true);
}

function start() { 
    play = true; 
    animate();
}

function pause() { play = false; }

function generateCars(n) {
    const cars = [];
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, carTraffic);
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
    
    let damagedCars = 0;
    for (let i = 0; i < cars.length; i++) {
        if (cars[i].damaged) { damagedCars++; }
    }
    if (optimalCar.damaged && (damagedCars * 1.0 / generatedCars) >= damagedThreshold) {
        saveBestCar();
        location.reload(true);
    }

    context.restore();

    netContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netContext, optimalCar.brain);
    if (play) {
        requestAnimationFrame(animate);
    }
}