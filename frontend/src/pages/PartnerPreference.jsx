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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Partner Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Preferred Religion</label>
          <input
            type="text"
            name="religion"
            value={preferences.religion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Preferred Education
          </label>
          <input
            type="text"
            name="education"
            value={preferences.education}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Marital Status</label>
          <select
            name="maritalStatus"
            value={preferences.maritalStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="widow">Widow</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Age From</label>
            <input
              type="number"
              name="ageFrom"
              value={preferences.ageFrom}
              onChange={handleChange}
              min="18"
              max="60"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Age To</label>
            <input
              type="number"
              name="ageTo"
              value={preferences.ageTo}
              onChange={handleChange}
              min="18"
              max="60"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Food Preference</label>
          <select
            name="foodChoice"
            value={preferences.foodChoice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="veg">Vegetarian</option>
            <option value="non veg">Non-Vegetarian</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Preferences
        </button>
      </form>
    </div>
  );
};

export default PartnerPreference;
