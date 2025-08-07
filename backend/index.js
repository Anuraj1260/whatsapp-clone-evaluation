require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const Message = require('./models/messageModel');

// Middleware
app.use(cors()); // Allows your frontend to communicate with this backend
app.use(express.json()); // Allows the server to understand JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend server is up and running!');
});

// API endpoint to get all conversations, grouped by user
app.get('/api/conversations', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 'asc' });
    const conversations = messages.reduce((acc, msg) => {
      (acc[msg.wa_id] = acc[msg.wa_id] || []).push(msg);
      return acc;
    }, {});
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// API endpoint to send a simple message from the UI
app.post('/api/send', async (req, res) => {
  try {
    const { wa_id, name, text } = req.body;
    const newMessage = new Message({
      wa_id,
      name,
      text,
      id: new mongoose.Types.ObjectId().toString(), // Create a unique ID for the message
      status: 'sent', // Set initial status to 'sent'
    });
    await newMessage.save(); // Save the message to the database
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// API endpoint to process real webhook payloads from the sample files
app.post('/api/webhook', async (req, res) => {
  const payload = req.body;
  console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

  try {
    // The actual data is nested inside the 'metaData' object
    const entry = payload.metaData?.entry?.[0];

    // Check if the payload is for a new message
    if (entry?.changes?.[0]?.value?.messages) {
      const messageData = entry.changes[0].value.messages[0];
      const contactData = entry.changes[0].value.contacts[0];
      
      const newMessage = new Message({
        wa_id: contactData.wa_id,
        name: contactData.profile.name,
        text: messageData.text.body,
        id: messageData.id, // The unique message ID from the webhook
        timestamp: new Date(parseInt(messageData.timestamp) * 1000),
        status: 'delivered', // Assume delivered when it hits our webhook
      });
      
      await newMessage.save();
      console.log('New message from webhook saved.');
    } 
    // Check if the payload is for a status update
    else if (entry?.changes?.[0]?.value?.statuses) {
      const statusData = entry.changes[0].value.statuses[0];
      
      // Use the 'id' to find the message and update its status
      await Message.updateOne(
        { id: statusData.id }, 
        { $set: { status: statusData.status } }
      );
      console.log(`Updated status for message ${statusData.id} to ${statusData.status}.`);
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});