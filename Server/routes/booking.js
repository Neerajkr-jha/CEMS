const express = require('express');
const router = express.Router();

const { bookEvent, sendbookingOtp, getMyBookings, confirmBooking, cancelBooking } = require('../controllers/bookingController.js');
const {protect,admin} = require('../middleware/auth.js');


router.post("/", protect, bookEvent);
router.post("/send-otp", protect, sendbookingOtp);
router.get("/my", protect, getMyBookings);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.delete("/:id/cancel", protect, cancelBooking);
 
module.exports = router;