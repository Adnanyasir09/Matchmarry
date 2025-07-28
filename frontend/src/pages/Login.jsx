import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// ✅ Use the environment variable
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form);

      if (res.data.user && res.data.token) {
        login(res.data.user);
        localStorage.setItem("token", res.data.token);

        const profileRes = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${res.data.token}`,
          },
        });

        const profile = profileRes.data;

        const isBasicComplete =
          profile.age && profile.gender && profile.profession && profile.salary;
        const isAdditionalComplete =
          profile.maritalStatus &&
          profile.state &&
          profile.diet &&
          profile.bodyType;
        const isPartnerPrefsComplete =
          profile.partnerPreferences &&
          profile.partnerPreferences.religion &&
          profile.partnerPreferences.ageRange?.min &&
          profile.partnerPreferences.ageRange?.max;

        if (!isBasicComplete) {
          navigate("/profile");
        } else if (!isAdditionalComplete) {
          navigate("/additional-details");
        } else if (!isPartnerPrefsComplete) {
          navigate("/partner-preference");
        } else {
          navigate("/matches");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
