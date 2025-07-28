import Message from "../models/Message.js";
import User from "../models/User.js";

// POST /api/messages
export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;

  try {
    const newMessage = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send message error:", err.message);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// GET /api/messages/:receiverId
export const getMessages = async (req, res) => {
  const receiverId = req.params.receiverId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err.message);
    res.status(500).json({ message: "Failed to load messages" });
  }
};
