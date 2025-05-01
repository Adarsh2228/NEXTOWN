// const { loadModel, prepareInputData } = require('../utils/mlModel');
// let model;

// const loadPredictionModel = async () => {
//   if (!model) {
//     try {
//       model = await loadModel();
//       console.log('Model loaded successfully');
//     } catch (error) {
//       console.error('Error loading model:', error);
//       throw new Error('Model loading failed');
//     }
//   }
// };

// const predictBestMonths = async (req, res) => {
//   const { businessType } = req.body;

//   try {
//     await loadPredictionModel();
//     console.log('Predicting best months for:', businessType);

//     if (!businessType) {
//       return res.status(400).json({ error: 'Invalid business type' });
//     }

//     // Prepare input data for the model
//     const inputData = prepareInputData(businessType);
//     const bestMonths = await model.get_best_months(businessType);

//     if (!bestMonths) {
//       return res.status(404).json({ error: 'Business category not found. Please input the correct category.' });
//     }

//     res.status(200).json(bestMonths);
//   } catch (error) {
//     console.error('Error predicting best months:', error.message, error.stack);
//     res.status(500).json({ error: 'An error occurred while fetching best performing months.' });
//   }
// };

// const predictBestBusinesses = async (req, res) => {
//   const { monthRange } = req.body;

//   try {
//     await loadPredictionModel();
//     console.log('Predicting best businesses for month range:', monthRange);

//     if (!monthRange) {
//       return res.status(400).json({ error: 'Invalid month range' });
//     }

//     // Prepare input data for the model
//     const inputData = prepareInputData(null, monthRange);
//     const bestBusinesses = await model.get_best_businesses_by_month_range(monthRange);

//     if (!bestBusinesses) {
//       return res.status(404).json({ error: 'No data found for the given month range.' });
//     }

//     res.status(200).json(bestBusinesses);
//   } catch (error) {
//     console.error('Error predicting best businesses:', error.message, error.stack);
//     res.status(500).json({ error: 'An error occurred while fetching best performing businesses.' });
//   }
// };

// module.exports = { predictBestMonths, predictBestBusinesses };
// backend/utils/mlcontroller.js



const { spawn } = require('child_process');
const path = require('path');

// Controller for predicting best performing months
const predictBestMonths = async (req, res) => {
    const businessCategory = req.body.category;

    if (!businessCategory) {
        return res.status(400).json({ error: 'Business category is required' });
    }

    const pythonProcess = spawn('python', [path.join(__dirname, '../utils/predict_model.py')], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.stdin.write(JSON.stringify({ category: businessCategory }));
    pythonProcess.stdin.end();

    let outputData = '';
    
    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const result = JSON.parse(outputData.trim());
            console.log(`Python output: ${outputData}`);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error parsing Python response:', error);
            res.status(500).json({ error: 'Error parsing Python response', details: outputData.trim() });
        }
    });

    pythonProcess.stderr.on('data', (error) => {
        console.error(`Python process error: ${error.toString()}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error while processing request' });
        }
    });
};

module.exports = { predictBestMonths };