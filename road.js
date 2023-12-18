class Road {
    constructor(x, width, lanes=3) {
        this.x = x;
        this.width = width;
        this.lanes = lanes;

        // Left and right sides of the road
        this.left = x + width/2;
        this.right = x - width/2;

        // Top and Bottom of the Road (infinite)
        const inf = 10000000;
        this.top = -inf;
        this.bottom = inf;
    }

    draw(context) {
        // Road styles
        context.lineWidth = 5;
        context.strokeStyle = 'white';

        // Draw the left-side of the road
        context.beginPath();
        context.moveTo(this.left, this.top);
        context.lineTo(this.left, this.bottom);
        context.stroke();

        // Draw the right-side line fo the road
        context.beginPath();
        context.moveTo(this.right, this.top);
        context.lineTo(this.right, this.bottom);
        context.stroke();

    }
}