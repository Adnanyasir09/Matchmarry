import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-white to-emerald-300 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue your journey ❤️
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-rose-700 hover:shadow-lg transition-all"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-pink-600 hover:text-pink-700 font-semibold transition"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
