import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to view matches.");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/users/matches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMatches(res.data);
      } catch (error) {
        console.error("Error fetching matches:", error.message);
        alert("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user?.token]);

  // Skeleton loader for better UX
  const renderSkeleton = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="animate-pulse border rounded-2xl p-5 bg-white shadow-sm"
      >
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-5"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-11 bg-gray-300 rounded-xl"></div>
      </div>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-6 py-16 pt-24">
      <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-14 tracking-tight">
        ✨ Discover Matching Profiles
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {renderSkeleton()}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          No matches found based on your preferences.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {matches.map((match) => (
            <div
              key={match._id}
              className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <img
                src={match.profilePicture || "/default-profile.png"}
                alt={`${match.name}'s profile`}
                className="w-full h-56 object-cover rounded-xl mb-5"
              />

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {match.name}
              </h3>

              <div className="text-gray-600 space-y-2 text-base">
                <p>
                  <span className="font-semibold text-gray-800">Age:</span>{" "}
                  {match.age || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Profession:</span>{" "}
                  {match.profession || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Location:</span>{" "}
                  {match.state || "Not specified"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/profile/${match._id}`)}
                className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:opacity-90 hover:shadow-lg transition-all"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
