require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Define Schema & Model
const responseSchema = new mongoose.Schema({
    name: String,
    email: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const Response = mongoose.model('Response', responseSchema);

// API Endpoint to Store Google Form Responses
app.post('/submit', async (req, res) => {
    try {
        const { name, email, score } = req.body;
        const newResponse = new Response({ name, email, score });
        await newResponse.save();
        res.status(201).json({ message: 'Response saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving response' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
