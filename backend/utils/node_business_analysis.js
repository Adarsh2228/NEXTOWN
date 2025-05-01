const { spawn } = require('child_process');
const path = require('path');

exports.analyzeBusinessData = (businessType) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'python_entry.py');
    const process = spawn('python', [scriptPath, businessType]);

    let data = '';
    let error = '';

    process.stdout.on('data', (chunk) => { data += chunk.toString(); });
    process.stderr.on('data', (chunk) => { error += chunk.toString(); });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject("Failed to parse Python output");
        }
      } else {
        reject(error);
      }
    });
  });
};
