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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-500 text-white px-4">
      <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-10 md:p-12 w-full max-w-md text-center transition-all duration-300 animate-fade-in">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <h1 className="text-4xl font-bold mt-4 mb-2">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-lg font-medium text-gray-600">
            Let’s help you find your perfect match!
          </p>
        </div>
        <button
          onClick={handleContinue}
          className="mt-6 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-transform transform hover:scale-105 shadow-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Welcome;
