class Sensors {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.rayTotalAngle = Math.PI / 2;

        this.rays = [];
        this.sensorReadings = [];
    }

    update(borders) {

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

        ////////// CAST RAYS CODE - END //////////

        ////////// SENSOR READINGS CODE //////////

        this.sensorReadings = [];
        
    }

    draw(context) {
        for (let i = 0; i < this.rays.length; i++) {
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "yellow";
            context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            context.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            context.stroke();
        }
    }
}