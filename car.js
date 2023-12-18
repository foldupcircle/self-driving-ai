class Car {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controls = new Controls();
        this.speed = 0;
        this.acceleration = 1;
        this.max_speed = 5;
        this.friction = 0.2;
        this.angle = 0;
        this.sensors = new Sensors(this);
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(-this.angle);
        context.beginPath();

        context.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        
        context.fill();
        context.restore();

        // Draw Sensor Rays
        this.sensors.draw(context);
    }

    update(borders) {

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

        ////////// CAR MOVEMENT CODE - END //////////

        ////////// UPDATE SENSORS //////////

        this.sensors.update(borders);

        ////////// UPDATE SENSORS - END //////////

        
    }
}