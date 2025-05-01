const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let modelLoaded = false;

// Function to load the ML model
const loadModel = () => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, 'train_model.py')]);

        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(`Model Load Output: ${output}`);
            if (output.includes('Model saved')) { 
                modelLoaded = true;
                resolve();
            } else {
                reject('Failed to load model');
            }
        });

        pythonProcess.stderr.on('data', (error) => {
            console.error(`Error loading model: ${error.toString()}`);
            reject(error);
        });

        pythonProcess.on('exit', (code) => {
            console.log(`Model loading process exited with code ${code}`);
        });
    });
};

// Function to predict performance using the trained model
const predictPerformance = (inputData) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, 'predict_model.py')]);

        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`Prediction Output: ${output}`);
            try {
                resolve(JSON.parse(output));
            } catch (error) {
                reject('Failed to parse prediction output');
            }
        });

        pythonProcess.stderr.on('data', (error) => {
            console.error(`Error: ${error.toString()}`);
            reject(error);
        });

        pythonProcess.on('exit', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    });
};

// Export the functions
module.exports = { loadModel, predictPerformance };