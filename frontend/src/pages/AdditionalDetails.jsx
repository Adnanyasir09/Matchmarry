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
        console.error("Error fetching user details:", err.response?.data || err.message);
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
      console.error("Error saving additional details:", err.response?.data || err.message);
      alert("Failed to save details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-xl w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Your Personal Details</h2>

        <div>
          <label className="block mb-1 font-semibold">Marital Status</label>
          <select
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="widow">Widow</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select State</option>
            {/* India states dropdown */}
            {[
              "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
              "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
              "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
              "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
              "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
              "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
              "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
            ].map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Living With</label>
          <select
            name="livingWithFamily"
            value={form.livingWithFamily}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="with family">Family</option>
            <option value="separate">Separate</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Body Type</label>
          <select
            name="bodyType"
            value={form.bodyType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="slim">Slim</option>
            <option value="normal">Normal</option>
            <option value="fat">Fat</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Family Status</label>
          <select
            name="familyStatus"
            value={form.familyStatus}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="upper middle">Upper Middle</option>
            <option value="middle">Middle</option>
            <option value="below middle">Below Middle</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Diet</label>
          <select
            name="diet"
            value={form.diet}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="veg">Vegetarian</option>
            <option value="non veg">Non-Vegetarian</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdditionalDetails;
