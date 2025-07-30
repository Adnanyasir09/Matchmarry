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

  const renderSkeleton = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="animate-pulse border rounded-lg p-4 bg-blue"
      >
        <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    ));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-red-400 mb-10">
        Discover Matching Profiles
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderSkeleton()}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No matches found based on your preferences.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div
              key={match._id}
              className="bg-white border rounded-xl p-5 shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={match.profilePicture || "/default-profile.png"}
                alt={`${match.name}'s profile`}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                {match.name}
              </h3>

              <div className="text-gray-600 space-y-1 text-sm">
                <p>
                  <strong>Age:</strong> {match.age || "N/A"}
                </p>
                <p>
                  <strong>Profession:</strong> {match.profession || "Not specified"}
                </p>
                <p>
                  <strong>Location:</strong> {match.state || "Not specified"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/profile/${match._id}`)}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
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
