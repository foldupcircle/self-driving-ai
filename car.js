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
        this.polygon = [];
        this.damaged = false;
        this.brainAvail = (carType == "AI");
        this.carProgressLives = 100;
        if (carType != "TRAFFIC") { 
            this.sensors = new Sensors(this); 
            this.brain = new NeuralNet([this.sensors.rayCount, 6, 4]);
        }
        
    }

    draw(context, color, drawSensor=false) {

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
        if (this.sensors && drawSensor) { this.sensors.draw(context); }
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
            if (!this.damaged && this.carProgressLives <= 0) {
                this.damaged = true;
            }
            if (!this.damaged) {
                for (let i = 0; i < carTraffic.length; i++) {
                    if (polyIntersect(this.polygon, carTraffic[i].polygon)) { 
                        this.damaged = true;
                        break;
                    } else {
                        this.damaged = false;
                    }
                } 
            }
        }

        ////////// UPDATE SENSORS //////////

        if (this.sensors) { 
            this.sensors.update(borders, carTraffic); 
            const offsets = this.sensors.sensorReadings.map(s => s == null ? 0 : (1 - s.offset));
            const finalOutputs = NeuralNet.forwardProp(offsets, this.brain);
            
            // Settings outputs to the controls so AI can actually control the car
            if (this.brainAvail) {
                this.controls.forward = finalOutputs[0];
                this.controls.left = finalOutputs[1];
                this.controls.right = finalOutputs[2];
                this.controls.reverse = finalOutputs[3];
            }
        }

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