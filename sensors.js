class Sensors {
    constructor(car) {
        this.car = car;
        this.rayCount = 9;
        this.rayLength = 200;
        this.rayTotalAngle = Math.PI / 1.5;

        this.rays = [];
        this.sensorReadings = [];
    }

    update(borders, carTraffic) {

        ////////// CAST RAYS CODE //////////

        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const angle = lerp(this.rayTotalAngle / 2, -this.rayTotalAngle / 2, this.rayCount == 1 ? 0.5 : (i / (this.rayCount - 1))) + this.car.angle;
            const rayStart = {x: this.car.x, y: this.car.y};
            const rayEnd = {
                x: this.car.x - (Math.sin(angle) * this.rayLength), 
                y: this.car.y - (Math.cos(angle) * this.rayLength)
            };
            this.rays.push([rayStart, rayEnd]);
        }

        ////////// SENSOR READINGS CODE //////////

        this.sensorReadings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.sensorReadings.push(this.#getReading(this.rays[i], borders, carTraffic));
        }

    }

    #getReading(ray, borders, carTraffic) {

        // Get sensor readings from intersection with borders
        let values = [];
        for (let i = 0; i < borders.length; i++) {
            const val = getIntersection(ray[0], ray[1], borders[i][0], borders[i][1]);
            if (val) { values.push(val); }
        }

        // ...with traffic cars
        for (let i = 0; i < carTraffic.length; i++) {
            const trafficCar = carTraffic[i].polygon;
            for (let j = 0; j < trafficCar.length; j++) {
                const val = getIntersection(ray[0], ray[1], trafficCar[j], trafficCar[(j + 1) % trafficCar.length]);
                if (val) { values.push(val); }
            }
        }

        // Get the min of all readings (closest obstacle to car)
        if (values.length == 0) { return null; }
        else {
            const offsets = values.map(o => o.offset);
            const minOffset = Math.min(...offsets);
            return values.find(o => o.offset == minOffset);
        }
    }

    draw(context) {
        for (let i = 0; i < this.rays.length; i++) {
            let end = this.rays[i][1];
            if (this.sensorReadings[i]) { end = this.sensorReadings[i]; }

            // Yellow Lines for valid sensor reading space
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "yellow";
            context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            context.lineTo(end.x, end.y);
            context.stroke();

            // Intersection to end of where the reading could have reached out to
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            context.lineTo(end.x, end.y);
            context.stroke();
        }
    }
}