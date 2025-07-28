
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react"; // ✅ Correct


const BASE_URL = "http://localhost:5000"; // Your backend is running here

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

      // Navigate to next page only if save is successful
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
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>
    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
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
