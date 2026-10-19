const crypto = require('crypto');
const Booking = require('../models/Bookings.js');
const razorpay = require('../config/razorpay.js');

// Create an order using the event's fixed ticket price
const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only the booking owner can pay
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to pay for this booking",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Booking must be confirmed before payment",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This booking is already paid",
      });
    }

    const event = booking.eventId;

    if (!event || !Number.isFinite(Number(event.ticketPrice))) {
      return res.status(400).json({
        message: "Invalid event ticket price",
      });
    }

    const amountInPaise = Math.round(
      Number(event.ticketPrice) * 100
    );

    if (amountInPaise <= 0) {
      return res.status(400).json({
        message: "Ticket price must be greater than zero",
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
      },
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({
      message: "Unable to create payment order",
    });
  }
};

// Verify the payment before marking the booking as paid
const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Booking is not confirmed",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.json({
        message: "Booking is already paid",
      });
    }

    // Retrieve the actual order from Razorpay.
    // Do not trust an order ID supplied by the browser alone.
    const order = await razorpay.orders.fetch(
      razorpay_order_id
    );

    if (
      order.notes?.bookingId !== booking._id.toString() ||
      order.amount !== Math.round(
        Number(booking.eventId.ticketPrice) * 100
      ) ||
      order.currency !== "INR"
    ) {
      return res.status(400).json({
        message: "Payment order does not match this ticket",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.id}|${razorpay_payment_id}`)
      .digest("hex");

    const signatureBuffer = Buffer.from(
      razorpay_signature || "",
      "utf8"
    );
    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8"
    );

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      )
    ) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // A valid signature alone is not enough:
    // confirm that Razorpay has captured the full payment.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== order.id ||
      payment.status !== "captured" ||
      payment.amount !== order.amount ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        message: "Payment is not captured or amount is incorrect",
      });
    }

    booking.paymentStatus = "paid";
    await booking.save();

    res.json({
      message: "Payment verified successfully",
      paymentStatus: booking.paymentStatus,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      message: "Unable to verify payment",
    });
  }
};

module.exports = {
    createPaymentOrder,
    verifyPayment
};
