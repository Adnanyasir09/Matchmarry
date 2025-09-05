import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

// ✅ Dynamic BASE_URL from .env
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user?.token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <p className="text-xl text-gray-700 animate-pulse">
          Loading profile...
        </p>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <p className="text-xl text-gray-700">Profile not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-6 py-16 pt-24">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 lg:flex gap-10 items-center transition-all duration-300 hover:shadow-2xl">
        
        {/* Profile Image */}
        <div className="flex-shrink-0 flex justify-center">
          <img
            src={profile.profilePicture || "/default-profile.png"}
            alt="Profile"
            className="w-48 h-48 object-cover rounded-full border-4 border-pink-200 shadow-md"
          />
        </div>

        {/* Profile Details */}
        <div className="mt-8 lg:mt-0 lg:flex-1">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            {profile.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 text-base">
            <p>
              <span className="font-semibold text-gray-900">Age:</span>{" "}
              {profile.age || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Gender:</span>{" "}
              {profile.gender || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Profession:</span>{" "}
              {profile.profession || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">State:</span>{" "}
              {profile.state || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Religion:</span>{" "}
              {profile.religion || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Height:</span>{" "}
              {profile.height ? `${profile.height} cm` : "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Weight:</span>{" "}
              {profile.weight ? `${profile.weight} kg` : "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                Marital Status:
              </span>{" "}
              {profile.maritalStatus || "Not specified"}
            </p>
          </div>

          {/* Message Button */}
          <button
            onClick={() => navigate(`/chat/${profile._id}`)}
            className="mt-8 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg font-semibold rounded-xl shadow-md hover:opacity-90 hover:shadow-lg transition-all"
          >
            💬 Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
