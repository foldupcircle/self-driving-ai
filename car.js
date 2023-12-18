class Car {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controls = new Controls();
        this.speed = 0;
        this.acceleration = 0.2;
        this.max_speed = 3;
        this.friction = 0.05;
    }

    draw(context) {
        context.beginPath();
        context.rect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height
        );
        context.fill();
    }

    update() {
        // Keyboard control updates
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // Max Speed Constraints
        if (this.speed > this.max_speed) {
            this.speed = this.max_speed;
        }
        if (this.speed < -this.max_speed/2) {
            this.speed = -this.max_speed/2;
        }

        // Friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // Edge Case for when the Car stops
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        

        // Position Update
        this.y -= this.speed;
    }
}