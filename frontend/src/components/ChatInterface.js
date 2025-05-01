import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './ChatInterface.css';

const ChatInterface = ({ businessId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/businesses/${businessId}/chat`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [businessId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const response = await axios.post(`/api/businesses/${businessId}/chat/messages`, {
        content: newMessage
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg._id} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
            <p>{msg.content}</p>
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;