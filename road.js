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

        for (let i = 0; i <= this.lanes; i++) {

            // Set Lines to dashes for lanes, otherwise keep regular
            if (i != 0 && i != this.lanes) { context.setLineDash([20, 20]); } 
            else { context.setLineDash([]); }

            const x_val = lerp(this.left, this.right, i / this.lanes);

            // Draw the lanes of the road
            context.beginPath();
            context.moveTo(x_val, this.top);
            context.lineTo(x_val, this.bottom);
            context.stroke();
        }
        
    }

    getLaneCenter(laneIdx) {
        const lineWidth = this.width / this.lanes;
        return this.left + (lineWidth / 2) + (laneIdx * lineWidth);
    }
}