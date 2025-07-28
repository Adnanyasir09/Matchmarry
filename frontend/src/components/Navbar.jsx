import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideProfile = location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-black text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">

        {/* Hamburger Icon (Mobile) */}
        <div className="lg:hidden z-20">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center space-x-2"
          >
            <HeartIcon className="w-6 h-6 text-pink-500" />
            <span className="text-white font-semibold tracking-wide">MatchMarry</span>
          </Link>
        </div>

        {/* Right Side Links (Desktop) */}
        <div className="hidden lg:flex space-x-4 items-center ml-auto">
          {location.pathname !== "/" && (
            <Link to="/" className="hover:text-pink-500 px-4 py-2 transition">Home</Link>
          )}

          {user && !hideProfile ? (
            <>
              <Link to="/profile" className="hover:text-pink-500 px-4 py-2 transition flex items-center space-x-1">
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-pink-500 px-4 py-2 transition">Login</Link>
              {isHome && (
                <Link to="/register" className="hover:text-pink-500 px-4 py-2 transition">Register</Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-2 text-center">
          {location.pathname !== "/" && (
            <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-pink-500 px-4 py-2 transition">Home</Link>
          )}

          {user && !hideProfile ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-pink-500 px-4 py-2 transition"
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full bg-white text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-pink-500 px-4 py-2 transition"
              >
                Login
              </Link>
              {isHome && (
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-pink-500 px-4 py-2 transition"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
