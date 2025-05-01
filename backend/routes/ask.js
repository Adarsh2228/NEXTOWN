import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post('/', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const pythonPath = 'python'; // Use 'python3' if needed
    const scriptPath = path.join(__dirname, '..', 'utils', 'ask.py');

    const py = spawn(pythonPath, [scriptPath, question]); // <-- removed extra quotes

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      console.log('Python stdout:', output); // ✅ helpful for debugging
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          res.json(result);
        } catch (err) {
          console.error('Error parsing Python output:', err);
          res.status(500).json({ error: 'Error parsing Python output', details: err.message });
        }
      } else {
        console.error('Python error output:', errorOutput);
        res.status(500).json({ error: 'Python error', details: errorOutput });
      }
    });

  } catch (err) {
    console.error('Failed to ask question:', err);
    res.status(500).json({ error: 'Failed to ask question', details: err.message });
  }
});

export default router;
