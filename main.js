// Canvas for Cars
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// Canvas for Neural Net
const netCanvas = document.getElementById("netCanvas");
netCanvas.width = 400;

const context = canvas.getContext("2d");
const netContext = netCanvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5);
const carTraffic = [new Car(road.getLaneCenter(1), -100, 30, 50)]
car.draw(context);

animate();

function animate(time) {
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].update(road.borders);
    }
    car.update(road.borders, carTraffic);

    canvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    context.save();
    context.translate(0, -car.y + canvas.height * 0.8);
    road.draw(context);
    for (let i = 0; i < carTraffic.length; i++) {
        carTraffic[i].draw(context, "red");
    }
    car.draw(context, "blue");
    
    context.restore();

    netContext.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(netContext, car.brain);
    requestAnimationFrame(animate);
}