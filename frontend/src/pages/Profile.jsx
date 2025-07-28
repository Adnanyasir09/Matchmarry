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
          'Content-Type': 'application/json',
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
      console.error("Error updating profile:", err.response?.data || err.message);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Your Profile</h2>

      {message && <p className="text-center mb-4 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          name="dob"
          value={formData.dob ? formData.dob.split("T")[0] : ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Date of Birth"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="religion"
          value={formData.religion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Religion</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
          <option value="Sikh">Sikh</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={formData.profession}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="height"
          placeholder="Height (in cm)"
          value={formData.height}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary (monthly in ₹)"
          value={formData.salary}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
