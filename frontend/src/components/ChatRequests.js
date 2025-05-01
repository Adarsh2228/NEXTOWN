
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";
// import { FaPhone, FaVideo, FaPaperclip, FaPaperPlane, FaUser, FaComments, FaFileUpload } from "react-icons/fa";
// import "./ChatRequests.css"; // Import the CSS file

// const ChatRequests = () => {
//   const { businessId } = useParams();
//   const [chatRequests, setChatRequests] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:4000");
//     setSocket(newSocket);
//     return () => newSocket.close();
//   }, []);

//   useEffect(() => {
//     if (socket) {
//       socket.on("newMessage", (message) => {
//         if (message.receiverId === businessId || message.senderId === selectedUser) {
//           setMessages((prevMessages) => [...prevMessages, message]);
//         }
//       });
//     }
//   }, [socket, selectedUser, businessId]);

//   useEffect(() => {
//     const fetchChatRequests = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4000/api/chat/requests/${businessId}`);
//         setChatRequests(response.data);
//       } catch (error) {
//         console.error("Error fetching chat requests:", error);
//       }
//     };
//     fetchChatRequests();
//   }, [businessId]);

//   const loadChatHistory = async (userId) => {
//     try {
//       const response = await axios.get(`http://localhost:4000/api/chat/history/${userId}/${businessId}`);
//       setMessages(response.data);
//       setSelectedUser(userId);
//     } catch (error) {
//       console.error("Error loading chat history:", error);
//     }
//   };


//   const sendMessage = async () => {
//         if (!newMessage.trim()) return;
      
//         const chatMessage = {
//           senderId: businessId,
//           receiverId: selectedUser,
//           message: newMessage,
//           senderName: "Business", // Replace with the correct senderName
//         };
      
//         try {
//           const response = await axios.post("http://localhost:4000/api/chat/send", chatMessage);
//           setMessages([...messages, response.data]); // Use the response data
//           setNewMessage("");
//         } catch (error) {
//           console.error("Error sending message:", error);
//         }
//       };


//   // const sendMessage = async () => {
//   //   if (!newMessage.trim()) return;

//   //   const chatMessage = {
//   //     senderId: businessId,
//   //     receiverId: selectedUser,
//   //     message: newMessage,
//   //   };

//   //   try {
//   //     const response = await axios.post("http://localhost:4000/api/chat/send", chatMessage);
//   //     setMessages([...messages, response.data]);
//   //     setNewMessage("");
//   //   } catch (error) {
//   //     console.error("Error sending message:", error);
//   //   }
//   // };

//   const handleFileUpload = async (event) => {
//     const uploadedFile = event.target.files[0];
//     setFile(uploadedFile);

//     const formData = new FormData();
//     formData.append("file", uploadedFile);
//     formData.append("senderId", businessId);
//     formData.append("receiverId", selectedUser);

//     try {
//       const response = await axios.post("http://localhost:4000/api/chat/upload", formData);
//       setMessages([...messages, response.data]);
//       setFile(null);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   return (
//     <div className="chat-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2 className="sidebar-title">
//           <FaComments className="sidebar-icon" /> Chat Requests
//         </h2>
//         {chatRequests.map((request) => (
//           <button
//             key={request._id}
//             onClick={() => loadChatHistory(request._id)}
//             className="chat-request-button"
//           >
//             <FaUser className="button-icon" /> User {request._id}
//           </button>
//         ))}
//       </div>

//       {/* Chat Box */}
//       {selectedUser && (
//         <div className="chat-box">
//           {/* Chat Header */}
//           <div className="chat-header">
//             <h3 className="business-id">
//               <FaComments className="header-icon" /> Business ID: {businessId}
//             </h3>
//             <div className="header-buttons">
//               <button className="call-button">
//                 <FaPhone className="button-icon" /> Voice Call
//               </button>
//               <button className="video-button">
//                 <FaVideo className="button-icon" /> Video Call
//               </button>
//             </div>
//           </div>

//           {/* Chat Messages */}
//           <div className="chat-messages">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`message ${msg.senderId === businessId ? 'sent' : 'received'}`}
//               >
//                 <p>{msg.message}</p>
//               </div>
//             ))}
//           </div>

//           {/* Chat Input */}
//           <div className="chat-input">
//             <label className="file-upload-button">
//               <FaFileUpload className="button-icon" />
//               <input type="file" className="hidden" onChange={handleFileUpload} />
//             </label>
//             <input
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               className="message-input"
//               placeholder="Type a message..."
//             />
//             <button onClick={sendMessage} className="send-button">
//               <FaPaperPlane className="button-icon" /> Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatRequests;








import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { FaPhone, FaVideo, FaPaperPlane, FaUser, FaComments } from "react-icons/fa";
import "./ChatRequests.css";

const ChatRequests = () => {
  const { businessId } = useParams();
  const [chatRequests, setChatRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (
          message.receiverId === businessId ||
          message.senderId === selectedUser
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [socket, selectedUser, businessId]);

  // Fetch chat requests for the business
  useEffect(() => {
    const fetchChatRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/chat/requests/${businessId}`
        );
        setChatRequests(response.data);
      } catch (error) {
        console.error("Error fetching chat requests:", error);
      }
    };

    fetchChatRequests();
  }, [businessId]);

  // Load chat history for a selected user
  const loadChatHistory = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/chat/history/${userId}/${businessId}`
      );
      setMessages(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatMessage = {
      senderId: businessId,
      receiverId: selectedUser,
      message: newMessage,
      senderName: "Business",
    };

    try {
      await axios.post("http://localhost:4000/api/chat/send", chatMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">
          <FaComments className="sidebar-icon" /> Chat Requests
        </h2>
        {chatRequests.map((request) => (
          <button
            key={request._id}
            onClick={() => loadChatHistory(request.userId)}
            className="chat-request-button"
          >
            <FaUser className="button-icon" /> User {request.userId}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      {selectedUser && (
        <div className="chat-box">
          {/* Chat Header */}
          <div className="chat-header">
            <h3 className="business-id">
              <FaComments className="header-icon" /> Business ID: {businessId}
            </h3>
            <div className="header-buttons">
              <button className="call-button">
                <FaPhone className="button-icon" /> Voice Call
              </button>
              <button className="video-button">
                <FaVideo className="button-icon" /> Video Call
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderId === businessId ? "sent" : "received"}`}
                data-timestamp={new Date(msg.createdAt).toLocaleTimeString()}
              >
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="chat-input">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="send-button">
              <FaPaperPlane className="button-icon" /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRequests;