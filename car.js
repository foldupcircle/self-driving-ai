class Car {

    constructor(x, y, width, height, carType="TRAFFIC", maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controls = new Controls(carType);
        this.speed = 0;
        this.acceleration = 1;
        this.max_speed = maxSpeed;
        this.friction = 0.2;
        this.angle = 0;
        if (carType != "TRAFFIC") { this.sensors = new Sensors(this); }
        this.polygon = [];
        this.damaged = false;
        
    }

    draw(context, color) {

        // Adusting color for car based on collision (damaged or not)
        if (this.damaged) { context.fillStyle = "gray"; }
        else { context.fillStyle = color; }

        context.beginPath();
        if (this.polygon.length > 0) {
            context.moveTo(this.polygon[0].x, this.polygon[0].y);

            for (let i = 1; i < this.polygon.length; i++) {
                context.lineTo(this.polygon[i].x, this.polygon[i].y);
            }
            context.fill();
        }
        
        // Draw Sensor Rays
        if (this.sensors) { this.sensors.draw(context); }
    }

    update(borders, carTraffic=[]) {

        if (!this.damaged) {

            ////////// CAR MOVEMENT CODE //////////

            // Keyboard control updates
            if (this.controls.forward) { this.speed += this.acceleration; }
            if (this.controls.reverse) { this.speed -= this.acceleration; }

            // Max Speed Constraints
            if (this.speed > this.max_speed) { this.speed = this.max_speed; }
            if (this.speed < -this.max_speed/2) { this.speed = -this.max_speed/2; }

            // Friction
            if (this.speed > 0) { this.speed -= this.friction; }
            if (this.speed < 0) { this.speed += this.friction; }

            // Edge Case for when the Car stops
            if (Math.abs(this.speed) < this.friction) { this.speed = 0; }

            // Angle Movement
            const reverse = this.speed >= 0 ? 1 : -1;
            if (this.controls.left) { this.angle += 0.03 * reverse; }
            if (this.controls.right) { this.angle -= 0.03 * reverse; }

            // Position Update Based on Unit Circle
            this.y -= Math.cos(this.angle) * this.speed;
            this.x -= Math.sin(this.angle) * this.speed;

            ////////// GET CORNERS //////////

            this.polygon = this.#createPolygon();

            ////////// ASSESS DAMAGE //////////

            for (let i = 0; i < borders.length; i++) {
                if (polyIntersect(this.polygon, borders[i])) { 
                    this.damaged = true;
                    break;
                } else {
                    this.damaged = false;
                }
            } 

            for (let i = 0; i < carTraffic.length; i++) {
                if (polyIntersect(this.polygon, carTraffic[i].polygon)) { 
                    this.damaged = true;
                    break;
                } else {
                    this.damaged = false;
                }
            } 
        }

        ////////// UPDATE SENSORS //////////

        if (this.sensors) { this.sensors.update(borders, carTraffic); }

    }

    #createPolygon() {

        const pts = [];
        const cornerLength = Math.hypot(this.width / 2, this.height / 2);
        const alpha = Math.atan2(this.width, this.height);

        pts.push({
            x: this.x - Math.sin(this.angle - alpha) * cornerLength,
            y: this.y - Math.cos(this.angle - alpha) * cornerLength
        });
        pts.push({
            x: this.x - Math.sin(this.angle + alpha) * cornerLength,
            y: this.y - Math.cos(this.angle + alpha) * cornerLength
        });
        pts.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * cornerLength,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * cornerLength
        });
        pts.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * cornerLength,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * cornerLength
        });

        return pts;
    }
}