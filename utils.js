// For all utility functions

function lerp(start, end, diff) { // Linear Interpolation Function
    return start + (end - start) * diff;
}

function getIntersection(A, B, C, D) {
    // Returns the intersection if there is one between 2 edges or lines, one from A to B and the other from C to D
    // Useful for sensor rays and polyIntersect
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    
    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function polyIntersect(poly1, poly2) {
    // Checks whether poly1 and poly2 intersect, useful to see if cars are touching
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const intersect = getIntersection(
                poly1[i], 
                (poly1[(i + 1) % poly1.length]), 
                poly2[j], 
                (poly2[(j + 1) % poly2.length])
            );
            if (intersect) { return true; }
        }
    }
    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

function totalDistance(x1, y1, x2, y2) { // Applying the 2D Distance Formula
    return Math.sqrt( ((x2 - x1) ** 2) + ((y2 - y1) ** 2) );
}
