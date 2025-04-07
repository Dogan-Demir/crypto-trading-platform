import bgImage from "./assets/Background-blur.png";
import logo from "./assets/logoName.png";
import {Link, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from './AuthContext';

export default function Login() {
    const { login } = useAuth();
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
            <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2 text-amber-50">
                <Link to='/'><img src={logo} alt="logo" className="h-8 mr-2" /></Link>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" 
                 style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="bg-black/50 backdrop-blur-lg p-8 rounded-lg w-96">
                    <h2 className="text-2xl text-white mb-4">Login</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <form onSubmit={handleForm}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 rounded bg-gray-700 text-white"
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
                    <p className="text-white mt-4 text-center">
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
