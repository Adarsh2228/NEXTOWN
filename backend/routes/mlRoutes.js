const express = require('express');
const router = express.Router();
const { predictBestMonths } = require('../controllers/mlController'); 

// Define routes
router.post('/bestmonths', predictBestMonths);

module.exports = router;