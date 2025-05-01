// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema({
//   senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   message: { type: String, required: true },
//   senderName: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Chat", chatSchema);

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  senderName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);