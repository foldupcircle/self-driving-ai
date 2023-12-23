
function generateTraffic() {
    const carTestTraffic = [];
    for (let i = 0; i < 20; i++) {
        let numCars = Math.round(Math.random() + 1);
        const colNum = Math.floor(Math.random() * 3);
        if (numCars == 1) {
            carTestTraffic.push(new Car(road.getLaneCenter(colNum), carYStart - ((i + 1) * trafficCarDistance), 30, 50, "TRAFFIC", 0));
        } else {
            const rowNums = [];
            for (let r = 0; r < 2; r++) {
                if (r != colNum) { rowNums.push(r); }
            }
            carTestTraffic.push(new Car(road.getLaneCenter(rowNums[0]), carYStart - ((i + 1) * trafficCarDistance), 30, 50, "TRAFFIC", 0));
            carTestTraffic.push(new Car(road.getLaneCenter(rowNums[1]), carYStart - ((i + 1) * trafficCarDistance), 30, 50, "TRAFFIC", 0));
        }
    }
}

function reconstructBrain(brain) {
    const newBrain = new NeuralNet([this.sensors.rayCount, 6, 4]);
    for (let lvl = 0; lvl < bestBrain."levels".length; )
}