// Util functions that are called in main

function saveBestCar() {
    const optimalCarScore = score(optimalCar, carTraffic);
    if (optimalCarScore >= bestScore) {
        localStorage.setItem("bestCar", JSON.stringify(optimalCar.brain));
        localStorage.setItem("bestScore", JSON.stringify(optimalCarScore));
    }
    localStorage.setItem("lastRunScore", JSON.stringify(optimalCarScore));
    if (!optimalCar.finished) { location.reload(); }
    else { 
        saveLastRun(JSON.parse(localStorage.getItem("runData")));
        play = false; 
    }
}

function saveLastRun(runData) {
    if ((lastRunScore != 0 && optimalCar.y == carYStart) || optimalCar.finished) {
        console.log(runData);
        runData.y.push(JSON.parse(lastRunScore));
        runData.x.push(runData.x.length + 1);
        localStorage.setItem("runData", JSON.stringify(runData));
        Chart.drawChart(runData);
    }
}

function deleteBestCar() {
    localStorage.removeItem("bestCar");
    localStorage.removeItem("bestScore");
    localStorage.removeItem("runData");
    localStorage.removeItem("lastRunScore");
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