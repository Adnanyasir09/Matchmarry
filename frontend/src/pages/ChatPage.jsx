import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ChatPage = () => {
  const { receiverId } = useParams();
  const { user } = useContext(AuthContext);

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const socket = useRef(null);
  const bottomRef = useRef(null);

  // 🔌 Connect socket
  useEffect(() => {
    socket.current = io(BASE_URL);
    socket.current.emit("join", user._id);

    socket.current.on("newMessage", (message) => {
      const isForCurrentChat =
        (message.sender === receiverId && message.receiver === user._id) ||
        (message.sender === user._id && message.receiver === receiverId);

      if (isForCurrentChat) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user._id, receiverId]);

  // 📥 Fetch receiver and messages
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");

        const [receiverRes, messagesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users/${receiverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/messages/${receiverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setReceiver(receiverRes.data);
        setMessages(messagesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat data:", err);
        setError("Failed to load chat");
        setLoading(false);
      }
    };

    fetchChatData();
  }, [receiverId, user?.token]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    const token = user?.token || localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/messages`,
        { receiverId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMessage = res.data;
      socket.current.emit("sendMessage", savedMessage);
      setMessages((prev) => [...prev, savedMessage]);
      setText("");
    } catch (err) {
      console.error("Message send failed:", err);
      alert("Failed to send message. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading chat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md mt-6 h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b pb-2">
        Chat with <span className="text-blue-600">{receiver?.name}</span>
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 px-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow transition-all duration-300 ${
              msg.sender === user._id
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 rounded hover:bg-blue-700 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
