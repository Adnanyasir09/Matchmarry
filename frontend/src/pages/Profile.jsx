import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    religion: "",
    profession: "",
    height: "",
    salary: "",
    dob: "", // Added DOB
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      const res = await axios.put(`${BASE_URL}/api/users/me`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      setMessage("Profile updated successfully!");

      // Redirect to welcome page after short delay
      setTimeout(() => {
        navigate("/welcome");
      }, 300);
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response?.data || err.message,
      );
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-emerald-200 flex items-center justify-center px-4 py-12 pt-28">
  <div className="max-w-lg w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8">
    
    <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
      Update Your Profile
    </h2>

    {message && (
      <p className="text-center mb-4 text-blue-600 font-medium">{message}</p>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Age */}
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
      />

      {/* Date of Birth */}
      <input
        type="date"
        name="dob"
        value={formData.dob ? formData.dob.split("T")[0] : ""}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
        placeholder="Date of Birth"
      />

      {/* Gender */}
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Religion */}
      <select
        name="religion"
        value={formData.religion}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <option value="">Select Religion</option>
        <option value="Hindu">Hindu</option>
        <option value="Muslim">Muslim</option>
        <option value="Christian">Christian</option>
        <option value="Sikh">Sikh</option>
        <option value="Other">Other</option>
      </select>

      {/* Profession */}
      <input
        type="text"
        name="profession"
        placeholder="Profession"
        value={formData.profession}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
      />

      {/* Height & Salary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary (₹ per month)"
          value={formData.salary}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder-gray-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg shadow-lg hover:opacity-95 hover:shadow-xl transition"
      >
        Save Profile
      </button>

    </form>
  </div>
</div>

  );
};

export default Profile;
