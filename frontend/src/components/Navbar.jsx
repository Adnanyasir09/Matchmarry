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
  const hideProfile =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-black backdrop-blur-md text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between relative">
        
        {/* Hamburger Icon (Mobile) */}
        <div className="lg:hidden z-20">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <XMarkIcon className="w-7 h-7 text-white transition-transform duration-300" />
            ) : (
              <Bars3Icon className="w-7 h-7 text-white transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-3">
          {/* Icon */}
          <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/30">
            <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          {/* Text */}
          <span className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent font-extrabold tracking-wide drop-shadow-sm">
            MatchMarry
          </span>
        </div>

        {/* Right Side Links (Desktop) */}
        <div className="hidden lg:flex space-x-8 items-center ml-auto text-lg font-medium tracking-wide">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-gray-300 hover:text-rose-400 transition-colors duration-300"
            >
              Home
            </Link>
          )}

          {user && !hideProfile ? (
            <>
              <Link
                to="/profile"
                className="text-gray-300 hover:text-rose-400 transition-colors duration-300"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-rose-400 font-semibold hover:text-rose-500 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
              >
                Login
              </Link>
              {isHome && (
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-semibold"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md text-white overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 space-y-4 text-center text-lg font-medium">
          {location.pathname !== "/" && (
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-pink-400 px-4 py-2 transition-colors"
            >
              Home
            </Link>
          )}

          {user && !hideProfile ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-pink-400 px-4 py-2 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full bg-pink-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-pink-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-pink-400 px-4 py-2 transition-colors"
              >
                Login
              </Link>
              {isHome && (
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-pink-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-pink-600 transition"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
