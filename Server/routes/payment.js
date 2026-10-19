const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.js');

const {
    createPaymentOrder,
    verifyPayment
} = require('../controllers/paymentController.js');

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;