import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import AdditionalDetails from "./pages/AdditionalDetails";
import PartnerPreference from "./pages/PartnerPreference";
import Matches from "./pages/Matches"; // ✅ Import Matches page
import UserProfile from "./pages/UserProfile";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/details" element={<AdditionalDetails />} />
        <Route path="/partner-preference" element={<PartnerPreference />} />
        <Route path="/matches" element={<Matches />} /> {/* ✅ New route */}
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/chat/:receiverId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
