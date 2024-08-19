const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5001;
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/eventsDB');
mongoose.connect(mongoURI);

// Event Schema and Model
const eventSchema = new mongoose.Schema({
    name: String,
    fromDate: Date,
    toDate: Date,
    location: String,
    description: String,
    image: String, // Path to the uploaded image
    eventUrl: String,
    speaker: String,
    category: String,
    categoryDetail: String
});

const Event = mongoose.model('Event', eventSchema);

// Create Event
app.post('/api/events', upload.single('image'), async (req, res) => {
    try {
        const { name, fromDate, toDate, location, description, eventUrl, speaker, category, categoryDetail } = req.body;
        const image = req.file ? req.file.filename : null;
        const newEvent = new Event({ name, fromDate, toDate, location, description, image, eventUrl, speaker, category, categoryDetail });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error });
    }
});

// Read Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        const eventsWithUrls = events.map(event => ({
            ...event._doc,
            imageUrl: event.image ? `${req.protocol}://${req.get('host')}/uploads/${event.image}` : null
        }));
        res.status(200).json(eventsWithUrls);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error });
    }
});

// Update Event
app.put('/api/events/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, fromDate, toDate, location, description, eventUrl, speaker, category, categoryDetail } = req.body;
        // Extract filename from imageUrl if provided
        const image = req.file ? req.file.filename : req.body.image ? path.basename(req.body.image) : null;
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, fromDate, toDate, location, description, image, eventUrl, speaker, category, categoryDetail },
            { new: true }
        );
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error });
    }
});

// Delete Event
app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (event && event.image) {
            const filePath = path.join(__dirname, 'uploads', event.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
