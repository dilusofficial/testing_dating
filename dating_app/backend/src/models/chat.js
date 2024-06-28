const mongoose = require('mongoose');

const ChatRequestSchema = new mongoose.Schema({
  from: { type: String, required: true }, 
  to: { type: String, required: true }, 
  status: { type: String, default: 'pending' },
});

const ChatRequest = mongoose.model('ChatRequest', ChatRequestSchema);
module.exports = ChatRequest;