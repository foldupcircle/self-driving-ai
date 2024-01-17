// Util functions for test.js

function generateTraffic() { // Generates random car traffic
    const carTestTraffic = [];
    for (let i = 0; i < 20; i++) {
        let numCars = Math.floor((Math.random() * 2) + 1);
        const colNum = Math.floor(Math.random() * 3);
        if (numCars == 1) {
            carTestTraffic.push(new Car(road.getLaneCenter(colNum), carYStart - ((i + 1) * trafficCarDistance), 30, 50, "TRAFFIC", 0));
        } else {
            const rowNums = [];
            for (let r = 0; r < 3; r++) {
                if (r != colNum) { rowNums.push(r); }
            }
            carTestTraffic.push(new Car(road.getLaneCenter(rowNums[0]), carYStart - ((i + 1) * trafficCarDistance), 30, 50, "TRAFFIC", 0));
            carTestTraffic.push(new Car(road.getLaneCenter(rowNums[1]), carYStart - ((i + 1) * trafficCarDistance), 30, 50, "TRAFFIC", 0));
        }
    }
    return carTestTraffic;
}

function reconstructBrain(brain, rayCount) { // Turns best_brain in best-brain.js into NeuralNet object
    const newBrain = new NeuralNet([rayCount, 6, 4]);
    for (let lvl = 0; lvl < brain["levels"].length; lvl++) {
        const curr = brain["levels"][lvl];
        newBrain.levels[lvl].biases = curr["biases"];
        newBrain.levels[lvl].weights = curr["weights"];
        newBrain.levels[lvl].inputs = curr["inputs"];
        newBrain.levels[lvl].outputs = curr["outputs"];
    }
    return newBrain;
}

function testDeleteBestCar() { location.reload(); }

function testStartPause() {
    if (!play) {
        play = true; 
        testAnimate();
    } else {
        play = false;
    }
}
