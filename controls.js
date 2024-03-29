// Controls class for controlling car with arrow keys
// OBSOLETE

class Controls {

    constructor(carType) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        if (carType == "MAIN") {
            this.#addKeyBoardListeners();
        } else if (carType == "TRAFFIC") {
            this.forward = true;
        }
        
    }

    #addKeyBoardListeners() {

        // If key is pressed down, adjust corresponding direction to true
        document.onkeydown=(event) => {
            switch (event.key) {
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }

        // Change everything to false when no keys are pressed
        document.onkeyup=(event) => {
            switch (event.key) {
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}