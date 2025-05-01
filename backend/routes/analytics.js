import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// POST /api/analytics/:id
router.post('/:id', async (req, res) => {
  const { businessType } = req.body;

  if (!businessType) {
    return res.status(400).json({ error: 'Business type is required' });
  }

  try {
    const pythonPath = 'python'; // Or 'python3' depending on your OS
    const scriptPath = path.join(__dirname, '..', 'utils', 'analyzer.py');

    const py = spawn(pythonPath, [scriptPath, businessType]);

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          res.json(result);
        } catch (err) {
          console.error('JSON Parse Error:', err.message);
          console.error('Raw Output:', output);
          res.status(500).json({ error: 'Invalid response format from analyzer.py' });
        }
      } else {
        console.error('Python Script Error:', errorOutput);
        res.status(500).json({ error: 'Python script execution failed', details: errorOutput });
      }
    });
  } catch (err) {
    console.error('Analytics Route Error:', err);
    res.status(500).json({ error: 'Failed to execute analytics script' });
  }
});

export default router;
