import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Dynamic backend URL from environment variable
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Welcome = () => {
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("Hello");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const { name, religion } = res.data;
        setUserName(name);

        switch ((religion || "").toLowerCase()) {
          case "muslim":
          case "islam":
            setGreeting("Salaam");
            break;
          case "hindu":
          case "hinduism":
            setGreeting("Namaste");
            break;
          default:
            setGreeting("Hello");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handleContinue = () => {
    navigate("/details");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-500 to-pink-100 px-4 py-12">
  <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-10 md:p-12 w-full max-w-md text-center relative overflow-hidden">
    
    {/* Decorative gradient circles for a modern feel */}
    <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 opacity-30 animate-pulse-slow"></div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-purple-500 opacity-30 animate-pulse-slow"></div>

    {/* Avatar */}
    <div className="mb-6 relative z-10">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl transform hover:scale-105 transition-all duration-300">
        {userName ? userName.charAt(0).toUpperCase() : "U"}
      </div>
      <h1 className="text-4xl font-extrabold mt-4 mb-2 text-gray-800">
        {greeting}, {userName} 👋
      </h1>
      <p className="text-lg font-medium text-gray-600">
        Let’s help you find your perfect match!
      </p>
    </div>

    {/* Continue Button */}
    <button
      onClick={handleContinue}
      className="mt-8 px-10 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
    >
      Continue
    </button>

    {/* Subtle floating animation */}
    <style>
      {`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}
    </style>
  </div>
</div>

  );
};

export default Welcome;
