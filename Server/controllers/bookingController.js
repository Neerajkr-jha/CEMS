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
    try {
        const otp = generateOTP();
        await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
        await sendOtpEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
        console.log(error);
    }
}

const bookEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;

        const validOTP = await OTP.findOne({ email: req.user.email, action: 'event_booking' });

        if (!validOTP || validOTP.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }
        const booking = await Booking.create({
            userId: req.user._id,
            eventId: eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: event.ticketPrice,
            bookedAt: new Date(),
        })

        event.availableSeats -= 1;
        await event.save();

        await OTP.deleteOne({ _id: validOTP._id }); // cleanup -> Delete the OTP after successful booking
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error booking event', error: error.message });
        console.log(error);
    }

}


const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({
                message: 'Only pending bookings can be confirmed'
            });
        }

        const event = await Event.findById(booking.eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        // Update only the booking status
        booking.status = 'confirmed';
        await booking.save();

        // Send confirmation email
        // Note: req.user.email is the admin's email.
        // Use the booking owner's email if you want to notify the user.

        return res.status(200).json({
            message: 'Booking confirmed successfully'
        });

    } catch (error) {
        console.error("Confirm booking error:", error);

        return res.status(500).json({
            message: "Error confirming booking",
            error: error.message
        });
    }
};


const getMyBookings = async (req, res) => {
    try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user.id }).populate('eventId').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // Allow the booking owner or an admin
        if (
            booking.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'Not authorized'
            });
        }

        // Prevent restoring the same seat twice
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                message: 'Already cancelled'
            });
        }

        // Restore the reserved seat
        const event = await Event.findById(booking.eventId);

        if (event) {
            event.availableSeats = Math.min(
                event.availableSeats + 1,
                event.totalSeats
            );

            await event.save();
        }

        booking.status = 'cancelled';
        await booking.save();

        return res.status(200).json({
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel booking error:', error);

        return res.status(500).json({
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

module.exports = {
    bookEvent,
    sendbookingOtp,
    getMyBookings,
    confirmBooking,
    cancelBooking
};