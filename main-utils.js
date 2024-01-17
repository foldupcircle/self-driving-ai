// Util functions that are called in main

function saveBestCar() {
    // When training, saves the best car from that run
    // If car has reaches the finish line, this signifies training is complete
    // So training is stopped (play = false) and the brain is logged on console
    // To test this brain, one must copy and paste this result into best-brain.js
    const optimalCarScore = score(optimalCar, carYStart);
    if (optimalCarScore >= bestScore) {
        localStorage.setItem("bestCar", JSON.stringify(optimalCar.brain));
        localStorage.setItem("bestScore", JSON.stringify(optimalCarScore));
    }
    localStorage.setItem("lastRunScore", JSON.stringify(optimalCarScore));
    if (!optimalCar.finished) { location.reload(); }
    else { 
        saveLastRun(JSON.parse(localStorage.getItem("runData")));
        console.log(optimalCar.brain);
        
        play = false; 
    }
}

function saveLastRun(runData) {
    // Saves how far the best car in each run went to plot on chart
    if ((lastRunScore != 0 && optimalCar.y == carYStart) || optimalCar.finished) {
        if (optimalCar.finished) { lastRunScore = finish; }
        runData.y.push(
            Math.round( (lastRunScore / finish) * 100 )
        );
        runData.x.push(runData.x.length + 1);
        localStorage.setItem("runData", JSON.stringify(runData));
        Chart.drawChart(runData);
    }
}

function deleteBestCar() { // Removes all data from local storage
    localStorage.removeItem("bestCar");
    localStorage.removeItem("bestScore");
    localStorage.removeItem("runData");
    localStorage.removeItem("lastRunScore");
    location.reload();
}

function startPause() { // For start/stop button
    if (!play) {
        play = true; 
        animate();
    } else {
        play = false;
    }
}

function generateCars(n) { // Generates n cars for training
    const cars = [];
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3));
    }
    return cars;
}

function score(car, carYStart) { return Math.round(- (car.y - carYStart)); }
