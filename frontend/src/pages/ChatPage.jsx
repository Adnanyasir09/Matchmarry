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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <p className="text-xl text-gray-700 animate-pulse">Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2 sm:px-4 py-10 pt-20">
  <div className="w-full sm:max-w-xl flex flex-col bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl h-[85vh] sm:h-[80vh] overflow-hidden">
    
    {/* Chat Header */}
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 text-white shadow-lg border-b border-white/20">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={receiver?.profilePicture || "/default-profile.png"}
          alt={receiver?.name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 shadow-md"
        />
        <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white drop-shadow-md">
            {receiver?.name}
          </h2>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3 bg-gradient-to-b from-gray-500 to-gray-100">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`inline-flex px-3 sm:px-4 py-2 rounded-2xl shadow-sm transition-all break-words w-fit max-w-[80%] sm:max-w-xs ${
              msg.sender === user._id
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-br-none"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>

    {/* Input Box */}
    <div className="p-3 sm:p-4 border-t bg-gradient-to-r from-gray-500 to-gray-400 flex items-center gap-2 sm:gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        className="flex-grow px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
      />
      <button
        onClick={sendMessage}
        className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-md hover:opacity-90 transition text-sm sm:text-base"
      >
        Send
      </button>
    </div>
  </div>
</div>

  );
};

export default ChatPage;
