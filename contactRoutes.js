const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const newContact = new Contact({
            name,
            email,
            message
        });
        
        await newContact.save();
        
        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;