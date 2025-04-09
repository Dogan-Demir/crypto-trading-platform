import bgImage from "./assets/Background-blur.png";
import {Link, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import ThemeToggle from './components/ThemeToggle';

export default function Login() {
    const { login } = useAuth();
    const { isDarkMode } = useTheme();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleForm = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        // Check if the input is an email
        const isEmail = username.includes('@');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [isEmail ? 'email' : 'username']: username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data);
                navigate('/Portfolio');
            } else {
                setError(data.detail || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <>
            <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2">
                <div className="flex justify-between items-center">
                    <Link to='/' className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? "#ffffff" : "#000000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className={`font-bold text-xl ml-2 tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>CRYPTYX</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
            <div className={`min-h-screen flex items-center justify-center bg-cover bg-no-repeat ${isDarkMode ? '' : 'bg-gray-100'}`}
                 style={{ backgroundImage: isDarkMode ? `url(${bgImage})` : 'none' }}>
                <div className={`${isDarkMode ? 'bg-black/50 backdrop-blur-lg' : 'bg-white shadow-lg'} p-8 rounded-lg w-96`}>
                    <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Login</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <form onSubmit={handleForm}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Username"
                                className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800 border border-gray-300'}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800 border border-gray-300'}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Login
                        </button>
                    </form>
                    <p className={`mt-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
