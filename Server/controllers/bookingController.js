const express = require('express');
const OTP = require('../models/OTP.js');
const Event = require('../models/Event.js');
const Booking = require('../models/Bookings.js');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email.js');

const router = express.Router();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
const sendbookingOtp = async (req, res) => {
    const otp = generateOTP();
    console.log(req.body.email);
    await OTP.findOneAndDelete({ email: req.body.email, action: 'event_booking' }); // Delete any existing OTP for the same email and event
    await OTP.create({ email: req.body.email, otp: otp, action: 'event_booking' }); // Set expiration time to 5 minutes from now
    const email = req.body.email;
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
}

const bookEvent = async (req, res) => {
    const { eventId, otp } = req.body;

    const otpRecord = await OTP.findOne({ email: req.user.email, action: 'event_booking' });

    if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    if (event.totalSeats <= 0) {
        return res.status(400).json({ message: 'No seats available' });
    }
    const booking = await Booking.create({
        userId: req.user._id,
        eventId: eventId,
        status: 'pending',
        paymentStatus: 'unpaid',
        amount: event.ticketPrice
    })

    await OTP.deleteMany({ email: req.user.email, action: 'event_booking' }); // Delete the OTP after successful booking
    res.status(201).json({ message: 'Booking created successfully' });
}

const confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus;
    if (!['paid', 'unpaid'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status === 'confirmed') {
        return res.status(400).json({ message: 'Booking is already confirmed' });
    }

    const event = await Event.findById(booking.event._id);
    if (totalSeats <= 0) {
        return res.status(400).json({ message: 'No seats available' });
    }
    booking.status = 'confirmed';
    if (paymentStatus) {
        booking.paymentStatus = paymentStatus;
    }
    await booking.save();
    event.totalSeats -= 1;
    await event.save();

    //admin confirmation for booking, send email to user

    await sendBookingEmail(req.user.email, event.title, booking._id);
    res.status(200).json({ message: 'Booking confirmed successfully' });
}

const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
    res.status(200).json(bookings);
}
const cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }
    booking.status = 'cancelled';
    await booking.save();

    if (booking.status === 'confirmed') {
        const event = await Event.findById(booking.event._id);
        event.totalSeats += 1;
        await event.save();
    }

    await booking.remove();

    res.status(200).json({ message: 'Booking cancelled successfully' });
}
module.exports = {
    bookEvent,
    sendbookingOtp,
    getMyBookings,
    confirmBooking,
    cancelBooking
};