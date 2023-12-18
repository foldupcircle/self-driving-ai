class Road {
    constructor(x, width, lanes=3) {
        this.x = x;
        this.width = width;
        this.lanes = lanes;

        // Left and right sides of the road
        this.left = x - width/2;
        this.right = x + width/2;

        // Top and Bottom of the Road (infinite)
        const inf = 10000000;
        this.top = -inf;
        this.bottom = inf;

        // Adding borders
        this.borders = [
            [{x: this.left, y: this.top}, {x: this.left, y: this.bottom}], // TopLeft to BottomLeft
            [{x: this.right, y: this.top}, {x: this.right, y: this.bottom}] // TopRight to BottomRight
        ];
    }

    draw(context) {
        // Road styles
        context.lineWidth = 5;
        context.strokeStyle = 'white';

        for (let i = 1; i < this.lanes; i++) {

            // Set Lines to dashes for lanes
            context.setLineDash([20, 20]);

            const x_val = lerp(this.left, this.right, i / this.lanes);

            // Draw the lanes of the road
            context.beginPath();
            context.moveTo(x_val, this.top);
            context.lineTo(x_val, this.bottom);
            context.stroke();
        }

        context.setLineDash([]);
        this.borders.forEach(elem => {
            context.beginPath();
            context.moveTo(elem[0].x, elem[0].y);
            context.lineTo(elem[1].x, elem[1].y);
            context.stroke();
        });
        
    }

    getLaneCenter(laneIdx) {
        const laneWidth = this.width / this.lanes;
        return this.left + (laneWidth / 2) + (Math.min(laneIdx, this.lanes-1) * laneWidth);
    }

}