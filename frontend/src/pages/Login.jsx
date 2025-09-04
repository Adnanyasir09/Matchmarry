import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
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
          headers: { Authorization: `Bearer ${res.data.token}` },
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
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white bg-opacity-90 backdrop-blur p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600">
          Welcome Back
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Join us in finding your life partner ❤️
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-pink-600 font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
