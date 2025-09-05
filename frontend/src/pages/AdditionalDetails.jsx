import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

// ✅ Dynamically load base URL from .env
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdditionalDetails = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    maritalStatus: "",
    state: "",
    livingWithFamily: "",
    height: "",
    weight: "",
    bodyType: "",
    familyStatus: "",
    diet: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data;

        setForm((prev) => ({
          ...prev,
          maritalStatus: data.maritalStatus || "",
          state: data.state || "",
          livingWithFamily: data.livingWithFamily || "",
          height: data.height || "",
          weight: data.weight || "",
          bodyType: data.bodyType || "",
          familyStatus: data.familyStatus || "",
          diet: data.diet || "",
        }));
      } catch (err) {
        console.error(
          "Error fetching user details:",
          err.response?.data || err.message,
        );
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    try {
      const res = await axios.put(`${BASE_URL}/api/users/me`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Saved successfully:", res.data);
      navigate("/partner-preference");
    } catch (err) {
      console.error(
        "Error saving additional details:",
        err.response?.data || err.message,
      );
      alert("Failed to save details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-400 to-blue-200 flex items-center justify-center px-6 py-12 mt-16">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl w-full space-y-6 backdrop-blur-md"
  >
    <h2 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight">
      Your Personal Details
    </h2>

    {/* Marital Status */}
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">Marital Status</label>
      <select
        name="maritalStatus"
        value={form.maritalStatus}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select</option>
        <option value="single">Single</option>
        <option value="divorced">Divorced</option>
        <option value="widow">Widow</option>
      </select>
    </div>

    {/* State */}
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">State</label>
      <select
        name="state"
        value={form.state}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select State</option>
        {[
          "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
          "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
          "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
          "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
          "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
          "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
          "Ladakh","Lakshadweep","Puducherry"
        ].map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
    </div>

    {/* Living With */}
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">Living With</label>
      <select
        name="livingWithFamily"
        value={form.livingWithFamily}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select</option>
        <option value="with family">Family</option>
        <option value="separate">Separate</option>
      </select>
    </div>

    {/* Height & Weight */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-gray-700">Height (cm)</label>
        <input
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-gray-700">Weight (kg)</label>
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>
    </div>

    {/* Body Type */}
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">Body Type</label>
      <select
        name="bodyType"
        value={form.bodyType}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select</option>
        <option value="slim">Slim</option>
        <option value="normal">Normal</option>
        <option value="fat">Fat</option>
      </select>
    </div>

    {/* Family Status */}
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">Family Status</label>
      <select
        name="familyStatus"
        value={form.familyStatus}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select</option>
        <option value="upper middle">Upper Middle</option>
        <option value="middle">Middle</option>
        <option value="below middle">Below Middle</option>
      </select>
    </div>

    {/* Diet */}
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">Diet</label>
      <select
        name="diet"
        value={form.diet}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select</option>
        <option value="veg">Vegetarian</option>
        <option value="non veg">Non-Vegetarian</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-2xl font-semibold text-lg shadow-lg hover:opacity-95 hover:shadow-xl transition"
    >
      Submit
    </button>
  </form>
</div>

  );
};

export default AdditionalDetails;
