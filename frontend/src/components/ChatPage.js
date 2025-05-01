import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa";
import "./ChatPage.css";

const ChatPage = () => {
  const { businessId, userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/chat/history/${userId}/${businessId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [businessId, userId]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (
          (message.senderId === userId && message.receiverId === businessId) ||
          (message.senderId === businessId && message.receiverId === userId)
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket, userId, businessId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        senderId: userId,
        receiverId: businessId,
        message: newMessage,
        senderName: "User",
      };

      await axios.post("http://localhost:4000/api/chat/send", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="messages-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.senderId === userId ? "sent" : "received"}
            data-timestamp={new Date(message.createdAt).toLocaleTimeString()}
          >
            <strong>{message.senderId === userId ? "You" : "Business"}:</strong>{" "}
            {message.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;