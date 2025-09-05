import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const PartnerPreference = () => {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    religion: "",
    education: "",
    maritalStatus: "",
    ageFrom: "",
    ageTo: "",
    foodChoice: "",
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const user = res.data;

        if (user.partnerPreferences) {
          setPreferences({
            religion: user.partnerPreferences.religion || "",
            education: user.partnerPreferences.education || "",
            maritalStatus: user.partnerPreferences.maritalStatus || "",
            ageFrom: user.partnerPreferences.ageRange?.min?.toString() || "",
            ageTo: user.partnerPreferences.ageRange?.max?.toString() || "",
            foodChoice: user.partnerPreferences.diet || "",
          });
        }
      } catch (err) {
        console.error(
          "Failed to fetch preferences:",
          err.response?.data || err.message,
        );
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit preferences.");
      return;
    }

    const updateData = {
      partnerPreferences: {
        religion: preferences.religion,
        education: preferences.education,
        maritalStatus: preferences.maritalStatus,
        diet: preferences.foodChoice.toLowerCase(),
        ageRange: {
          min: Number(preferences.ageFrom),
          max: Number(preferences.ageTo),
        },
      },
    };

    try {
      const res = await axios.put(`${BASE_URL}/api/users/me`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Preferences saved:", res.data);
      alert("Preferences saved successfully!");
      navigate("/matches");
    } catch (err) {
      console.error(
        "Failed to save preferences:",
        err.response?.data || err.message,
      );
      alert("Failed to save partner preferences.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-50 to-pink-100 px-4 py-12 mt-14">
  <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6 relative overflow-hidden">
    
    

    <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Partner Preferences</h2>

    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
      
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Preferred Religion</label>
        <input
          type="text"
          name="religion"
          value={preferences.religion}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Preferred Education</label>
        <input
          type="text"
          name="education"
          value={preferences.education}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Marital Status</label>
        <select
          name="maritalStatus"
          value={preferences.maritalStatus}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">Select</option>
          <option value="single">Single</option>
          <option value="divorced">Divorced</option>
          <option value="widow">Widow</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Age From</label>
          <input
            type="number"
            name="ageFrom"
            value={preferences.ageFrom}
            onChange={handleChange}
            min="18"
            max="60"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Age To</label>
          <input
            type="number"
            name="ageTo"
            value={preferences.ageTo}
            onChange={handleChange}
            min="18"
            max="60"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Food Preference</label>
        <select
          name="foodChoice"
          value={preferences.foodChoice}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        >
          <option value="">Select</option>
          <option value="veg">Vegetarian</option>
          <option value="non veg">Non-Vegetarian</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
      >
        Submit Preferences
      </button>
    </form>

    
  </div>
</div>

  );
};

export default PartnerPreference;
