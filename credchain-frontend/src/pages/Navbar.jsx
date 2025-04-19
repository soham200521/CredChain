import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const login_func = async () => {
            try {
                const response = await axios.get('/isregistered', {
                    params: { email: user.email }
                });

                if (response.status === 200 && location.pathname === '/') {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error during registration check:', error);
                if (location.pathname === '/') {
                    navigate('/signup');
                }
            }
        };

        if (isAuthenticated && user && user.email && !isLoading) {
            login_func();
        }
    }, [isAuthenticated, isLoading, user, navigate, location.pathname]);

    return (
        <nav className="w-full px-16 py-4 bg-gradient-to-r from-[#181f3a] to-[#2a4365] flex items-center justify-between shadow">
            {/* Logo */}
            <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            >
                CredChain
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
                <Link
                    to="/about"
                    className="text-white text-lg font-medium hover:text-pink-400 transition"
                >
                    About Us
                </Link>
                <Link
                    to="/how-it-works"
                    className="text-white text-lg font-medium hover:text-pink-400 transition"
                >
                    How It Works
                </Link>
                <Link
                    to="/why-credchain"
                    className="text-white text-lg font-medium hover:text-pink-400 transition"
                >
                    Why CredChain?
                </Link>
                <Link
                    to="/contact"
                    className="text-white text-lg font-medium hover:text-pink-400 transition"
                >
                    Contact Us
                </Link>
                <Link
                    to="/credit-score"
                    className="text-white text-lg font-medium hover:text-pink-400 transition"
                >
                    View Score
                </Link>

                
                {/* Auth Buttons */}
                {!isAuthenticated ? (
                    <button
                        onClick={() => loginWithRedirect()}
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white font-semibold shadow hover:scale-105 transition"
                    >
                        Log In
                    </button>
                ) : (
                    <button
                        onClick={() => logout({ returnTo: window.location.origin })}
                        className="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
                    >
                        Log Out
                    </button>
                )}
            </div>
        </nav>
    );
}