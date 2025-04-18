import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom'; // Optional: Only if using react-router
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export default function Navbar() {
    const { loginWithRedirect, logout, user, isAuthenticated,isLoading } = useAuth0();

    const navigate=useNavigate()
  useEffect(() => {
    const login_func = async () => {
      try {
        const response = await axios.get('/isregistered', {
          params: { email: user.email }
        });

        if (response.status === 200 && location.pathname === '/') {
          navigate('/'); // ✅ only redirect if on root
        }
      } catch (error) {
        console.error('Error during registration check:', error);
        if (location.pathname === '/') {
          navigate('/signup'); // ✅ only redirect if on root
        }
      }
    };

    if (isAuthenticated && user && user.email && !isLoading) {
      login_func();
    }
  }, [isAuthenticated, isLoading, user, navigate, location.pathname]);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
        CredChain
      </div>
      <div className="flex space-x-6 items-center">
        {/* Use <a href=""> if not using react-router */}
        <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
          About Us
        </Link>
        <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
          Contact Us
        </Link>
        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Log In
          </button>
        ) : (
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
