// models/messageModel.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  wa_id: { type: String, required: true },
  name: { type: String, required: true },
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
  id: { type: String, unique: true, required: true },
  status: { type: String, default: 'sent' }, // Status can be 'sent', 'delivered', or 'read' [cite: 20]
});

const Message = mongoose.model('processed_messages', messageSchema); // Collection will be named 'processed_messages' [cite: 19]

module.exports = Message;