import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/solid";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-rose-200 to-pink-100 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-2xl">
        <div className="flex justify-center mb-4">
          <HeartIcon className="h-12 w-12 text-pink-600 animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold text-pink-700 mb-4 leading-tight">
          Find Love That Lasts ❤️
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to{" "}
          <span className="font-semibold text-pink-600">MatchMarry</span> — your
          trusted platform to discover meaningful relationships and lifelong
          partners.
        </p>
        <Link
          to="/register"
          className="inline-block bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-pink-700 transition duration-300"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
