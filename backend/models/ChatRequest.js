import mongoose from "mongoose";

const chatRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who initiated the chat
  businessId: { type: String, required: true }, // Business receiving the chat
  lastMessage: { type: String, default: "" }, // Last message sent in the chat
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ChatRequest = mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;
