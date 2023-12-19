class NeuralNet {
    constructor(neurons) {
        this.levels = [];
        for (let i = 0; i < neurons.length - 1; i++) { this.levels.push(new Level(neurons[i], neurons[i + 1])); }
    }

    static forwardProp(setInputs, net) {
        // Setting the first level of output
        let outputs = Level.forwardProp(setInputs, net.levels[0]);

        // forward propagating
        for (let i = 1; i < net.levels.length; i++) { 
            outputs = Level.forwardProp(outputs, net.levels[i]); 
        }

        return outputs;
    }

    static mutate(net, amount=1) {
        net.levels.forEach(lvl => {
            for (let i = 0; i < lvl.biases.length; i++) {
                lvl.biases[i] = lerp(lvl.biases[i], ((Math.random() * 2) - 1), amount);
            }
            for (let i = 0; i < lvl.weights.length; i++) {
                for (let j = 0; j < lvl.weights.length; j++) {
                    lvl.weights[i][j] = lerp(lvl.weights[i][j], ((Math.random() * 2) - 1), amount);
                }
            }
        });
    }
}

class Level {
    constructor(inputNeuronCount, outputNeuronCount) {
        this.inputs = new Array(inputNeuronCount);
        this.outputs = new Array(outputNeuronCount);
        this.biases = new Array(outputNeuronCount);

        // Weights
        this.weights = [];
        for (let i = 0; i < inputNeuronCount; i++) { this.weights[i] = new Array(outputNeuronCount); }

        // Start NN with random weights and biases
        Level.#shuffle(this);
    }

    static #shuffle(lvl) {

        // Set Weights
        for (let i = 0; i < lvl.inputs.length; i++) {
            for (let j = 0; j < lvl.outputs.length; j++) {
                lvl.weights[i][j] = (Math.random() * 2) - 1; // weights in range [-1, 1]
            }
        }

        // Set Biases
        for (let i = 0; i < lvl.inputs.length; i++) {
            lvl.biases[i] = (Math.random() * 2) - 1; // biases in range [-1, 1]
        }
    }

    static forwardProp(setInputs, lvl) {

        // Set Inputs to what is given in setInputs
        for (let i = 0; i < lvl.inputs.length; i++) {
            lvl.inputs[i] = setInputs[i];
        }

        // Set weights
        for (let i = 0; i < lvl.outputs.length; i++) {
            let weightedSum = 0;
            for (let j = 0; j < lvl.inputs.length; j++) {
                weightedSum += lvl.inputs[j] * lvl.weights[j][i];
            }

            if (weightedSum > lvl.biases[i]) { lvl.outputs[i] = 1; }
            else { lvl.outputs[i] = 0; }
        }

        return lvl.outputs;
    }
}