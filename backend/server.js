
// // Import dependencies using ES Modules syntax
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import http from "http";
// import { Server } from "socket.io";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// // Setup __dirname with ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Load environment variables
// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// app.use('/uploads', express.static('uploads'));


// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(error => {
//     console.error("❌ MongoDB connection error:", error);
//     process.exit(1);
//   });

// // Import routes using ES Modules syntax
// import userRoutes from "./routes/userRoutes.js";
// import businessRoutes from "./routes/businessRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import lscRoutes from "./routes/lscRoutes.js";
// import qaRoutes from "./routes/qaRoutes.js";
// import serviceRoutes from "./routes/serviceRoutes.js"; // New route added

// // Register routes
// app.use('/api/qa', qaRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/businesses", businessRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/chat", chatRoutes);
// app.use('/api/lsc', lscRoutes);
// app.use('/api/services', serviceRoutes); // New route added

// // WebSocket Setup
// const io = new Server(server, {
//   cors: { 
//     origin: process.env.CLIENT_URL || "http://localhost:3000" 
//   }
// });

// // Attach io to app
// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("🔗 User connected:", socket.id);
//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });

// // Error Handlers
// app.use((req, res) => res.status(404).json({ message: "API route not found" }));
// app.use((err, req, res, next) => {
//   console.error("❌ Global Error:", err.stack);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// // Start Server
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





// // server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import path from 'path';
// import http from 'http';
// import { Server } from 'socket.io';
// import { fileURLToPath } from 'url';
//  import { dirname } from 'path';

// // Import the routes
// import userRoutes from './routes/userRoutes.js';
// import businessRoutes from './routes/businessRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';
// import lscRoutes from './routes/lscRoutes.js';
// import qaRoutes from './routes/qaRoutes.js';
// import servRoutes from './routes/servRoutes.js';
// import analyticsRoute from './routes/analyticsRoute.js'; // ✅ Correct in ESM

// // Setup __dirname with ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Load environment variables
// dotenv.config();

// // Initialize Express app and HTTP server
// const app = express();
// const server = http.createServer(app);


// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/business-app', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(error => {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   });

// // Register API routes
// app.use('/api/users', userRoutes);
// app.use('/api/businesses', businessRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/lsc', lscRoutes);
// app.use('/api/qa', qaRoutes);
// app.use('/api/services', servRoutes); // ✅ Correct path to your services/products
// app.use("/api/analytics", analyticsRoute);

// // WebSocket Setup
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });

// io.on('connection', (socket) => {
//   console.log('🔗 User connected:', socket.id);

//   socket.on('joinBusinessRoom', (businessId) => {
//     socket.join(businessId);
//     console.log(`User ${socket.id} joined business room ${businessId}`);
//   });

//   socket.on('sendMessage', ({ businessId, message }) => {
//     io.to(businessId).emit('receiveMessage', message);
//   });

//   socket.on('sendNotification', ({ userId, notification }) => {
//     io.to(userId).emit('receiveNotification', notification);
//   });

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnected:', socket.id);
//   });
// });

// // Attach io instance to app so routes can access it
// app.set('io', io);

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'API route not found' });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error('❌ Global Error:', err.stack);
//   res.status(500).json({
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));










import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process'; // Required to call Python

// Import the routes
import userRoutes from './routes/userRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import lscRoutes from './routes/lscRoutes.js';
import qaRoutes from './routes/qaRoutes.js';
import servRoutes from './routes/servRoutes.js';
import analyticsRoutes from './routes/analytics.js';
import askRoute from './routes/ask.js';

// Setup __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Correct the path to the Python script
const scriptPath = path.join(__dirname, '..', 'utils', 'ask.py');

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Fix for legacy browsers + preflight success
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/business-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Register API routes
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/lsc', lscRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/services', servRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ask', askRoute);

// Analytics Route (Inline)
app.post('/api/analytics/:id', async (req, res) => {
  const { businessType } = req.body;

  try {
    const pythonPath = 'python3'; // Use 'python' or 'python3' depending on your OS
    const py = spawn(pythonPath, [scriptPath, businessType]);

    let output = '';
    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (err) => {
      console.error('Python error:', err.toString());
    });

    py.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          res.json(result);
        } catch (err) {
          console.error('JSON parse error:', err.message);
          res.status(500).json({ error: 'Invalid data from Python script' });
        }
      } else {
        console.error('Python script exited with error code', code);
        res.status(500).json({ error: 'Python script exited with error code ' + code });
      }
    });

  } catch (err) {
    console.error('Analytics Route Error:', err);
    res.status(500).json({ error: 'Failed to process analytics' });
  }
});

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  socket.on('joinBusinessRoom', (businessId) => {
    socket.join(businessId);
    console.log(`User ${socket.id} joined business room ${businessId}`);
  });

  socket.on('sendMessage', ({ businessId, message }) => {
    io.to(businessId).emit('receiveMessage', message);
  });

  socket.on('sendNotification', ({ userId, notification }) => {
    io.to(userId).emit('receiveNotification', notification);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Attach io instance to app so routes can access it
app.set('io', io);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
