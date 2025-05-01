import ChatMessage from '../models/ChatMessage.js';
import ChatRequest from '../models/ChatRequest.js';
import mongoose from 'mongoose';

// Send a message and create/update a chat request
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderName } = req.body;

    const missingFields = [];
    if (!senderId) missingFields.push("senderId");
    if (!receiverId) missingFields.push("receiverId");
    if (!message) missingFields.push("message");
    if (!senderName) missingFields.push("senderName");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newMessage = new ChatMessage({
      senderId,
      receiverId,
      message,
      senderName,
      timestamp: new Date(),
    });

    await newMessage.save();

    let chatRequest = await ChatRequest.findOne({
      userId: senderId,
      businessId: receiverId,
    });

    if (!chatRequest) {
      chatRequest = new ChatRequest({
        userId: senderId,
        businessId: receiverId,
        lastMessage: message,
      });
    } else {
      chatRequest.lastMessage = message;
      chatRequest.updatedAt = Date.now();
    }

    await chatRequest.save();

    const io = req.app.get("io");
    io.emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      error: "Message send failed",
      details: error.message,
    });
  }
};

// Get chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { userId, businessId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(businessId)
    ) {
      return res.status(400).json({ error: "Invalid user or business ID" });
    }

    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: businessId },
        { senderId: businessId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Fetch chat requests for a business
export const getChatRequests = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: "Invalid business ID" });
    }

    const chatRequests = await ChatRequest.find({ businessId }).sort({
      updatedAt: -1,
    });

    res.status(200).json(chatRequests);
  } catch (error) {
    console.error("Error fetching chat requests:", error);
    res.status(500).json({ error: "Failed to fetch chat requests" });
  }
};

// Get messages between a user and a business
export const getMessages = async (req, res) => {
  try {
    const { userId, businessId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(businessId)
    ) {
      return res.status(400).json({ error: "Invalid user or business ID" });
    }

    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: businessId },
        { senderId: businessId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
