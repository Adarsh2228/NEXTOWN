// backend/controllers/businessController.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

exports.getBusinessAnalytics = async (req, res) => {
  const { businessType } = req.body;

  if (!businessType) {
    return res.status(400).json({ error: "Business type is required" });
  }

  try {
    const { analyzeBusinessData } = require('../utils/node_business_analysis');
    const result = await analyzeBusinessData(businessType);
    res.json(result);
  } catch (err) {
    console.error("Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze business data" });
  }
};
