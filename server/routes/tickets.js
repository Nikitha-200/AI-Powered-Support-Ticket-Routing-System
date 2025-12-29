const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { classifyTicket } = require('../utils/openai');

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const classification = await classifyTicket(title, description);
    const newTicket = new Ticket({
      title,
      description,
      category: classification.category,
      priority: classification.priority,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
});

// Get all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});

// Update ticket status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
});

module.exports = router;
