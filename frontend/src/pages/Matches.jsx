import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Adjust the path if needed

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Matching Profiles</h2>

      {loading ? (
        <p className="text-center">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-600">No matches found based on your preferences.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 bg-white"
            >
              <img
                src={match.profilePicture || "/default-profile.png"}
                alt={`${match.name}'s profile`}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-semibold">{match.name}</h3>
              <p className="text-sm text-gray-700">Age: {match.age}</p>
              <p className="text-sm text-gray-700">Profession: {match.profession || "N/A"}</p>
              <p className="text-sm text-gray-700">Location: {match.state || "Not specified"}</p>

              <button
                onClick={() => navigate(`/profile/${match._id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
