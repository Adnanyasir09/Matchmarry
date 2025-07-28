import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


// ✅ Setup CORS for both local and deployed frontends
const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  "https://matchmarry.vercel.app",          // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Connect MongoDB
connectDB();



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);


// Create HTTP server
const server = http.createServer(app);

// Socket.io setup

// ✅ Updated Socket.io CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Save user ID with socket ID
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User added:", userId);
  });

  socket.on("sendMessage", (message) => {
  const { receiver } = message;
  const receiverSocketId = onlineUsers.get(receiver);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    [...onlineUsers.entries()].forEach(([userId, socketId]) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
