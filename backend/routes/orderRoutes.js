const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.post('/:id/accept', orderController.acceptOrder);
router.post('/:id/reject', orderController.rejectOrder);
router.post('/:id/complete', orderController.completeOrder);

module.exports = router; // Ensure this exports the router correctly
