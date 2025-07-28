import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

const ChatPage = () => {
  const { receiverId } = useParams();
  const { user } = useContext(AuthContext);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socket = useRef(null);

  // 🔌 CONNECT TO SOCKET
  useEffect(() => {
    socket.current = io(BASE_URL);

    // Join user's room
    socket.current.emit("join", user._id); // use _id if that's what your backend sends

    // Listen for incoming messages
    socket.current.on("newMessage", (message) => {
      if (
        (message.sender === receiverId && message.receiver === user._id) ||
        (message.sender === user._id && message.receiver === receiverId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user._id, receiverId]);

  // 📥 Fetch receiver info
  useEffect(() => {
    const fetchReceiver = async () => {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/users/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReceiver(res.data);
    };
    fetchReceiver();
  }, [receiverId, user?.token]);

  // 📥 Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/messages/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, [receiverId, user?.token]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    const token = user?.token || localStorage.getItem("token");

    const message = { receiverId, text };

    try {
      const res = await axios.post(`${BASE_URL}/api/messages`, message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedMessage = res.data;

      // Emit to socket with correct message structure
      socket.current.emit("sendMessage", savedMessage);

      // Push the message to chat history
      setMessages((prev) => [...prev, savedMessage]);

      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">
        Chat with {receiver?.name || "User"}
      </h2>

      <div className="border h-96 overflow-y-scroll p-3 space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
  key={idx}
  className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm break-words ${
    msg.sender === user._id
      ? "ml-auto bg-blue-600 text-white"
      : "mr-auto bg-gray-200 text-gray-800"
  }`}
>
  {msg.text}
</div>

        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
