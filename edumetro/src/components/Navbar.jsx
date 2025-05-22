import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">EduMetro</Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
