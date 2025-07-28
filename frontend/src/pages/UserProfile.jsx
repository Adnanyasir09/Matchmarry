import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

// ✅ Dynamic BASE_URL from .env file
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

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (!profile) return <div className="text-center mt-10">Profile not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <div className="flex flex-col items-center">
        <img
          src={profile.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-40 h-40 object-cover rounded-full border mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
        <p className="text-gray-600">Age: {profile.age}</p>
        <p className="text-gray-600">Gender: {profile.gender}</p>
        <p className="text-gray-600">Profession: {profile.profession}</p>
        <p className="text-gray-600">State: {profile.state}</p>
        <p className="text-gray-600">Religion: {profile.religion}</p>
        <p className="text-gray-600">Height: {profile.height} cm</p>
        <p className="text-gray-600">Weight: {profile.weight} kg</p>
        <p className="text-gray-600">Marital Status: {profile.maritalStatus}</p>

        <button
          onClick={() => navigate(`/chat/${profile._id}`)}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
