class Sensors {
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLength = 100;
        this.rayTotalAngle = Math.PI / 4;

        this.rays = [];
    }

    update() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const angle = lerp(this.rayTotalAngle / 2, -this.rayTotalAngle / 2, i / (this.rayCount - 1));
            const rayStart = {x: this.car.x, y: this.car.y};
            const rayEnd = {
                x: this.car.x - (Math.sin(angle) * this.rayLength), 
                y: this.car.y - (Math.cos(angle) * this.rayLength)
            };
            this.rays.push([rayStart, rayEnd]);
        }
    }

    draw(context) {
        for (let i = 0; i < this.rayCount; i++) {
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = 'yellow';
            context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            context.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            context.stroke();
        }
    }
}