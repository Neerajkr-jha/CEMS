const express = require('express');
const Event = require('../models/Event.js');

const router = express.Router();

// get all events
const getAllEvents = router.get('/', async (req, res) => {
    try {

        const filters = {};//filters based on query parameters
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.location) {
            filters.location = req.query.location;
        }


        const events = await Event.find(filters);
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

const getEventById = router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

const createEvent = router.post('/', async (req, res) => {
    const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl,
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

const updateEvent = router.put('/:id', async (req, res) => {
        const { title, description, date, location, category, totalSeats, ticketPrice, imageUrl } = req.body;
        try {
            const eventId = req.params.id;
            const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    })

const deleteEvent = router.delete('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };