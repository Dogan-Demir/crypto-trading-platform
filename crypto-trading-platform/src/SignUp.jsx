import React, { useState } from "react";
import bgImage from "./assets/Background-blur.png";
import { Link } from "react-router-dom";
import { useTheme } from './ThemeContext';
import ThemeToggle from './components/ThemeToggle';

export default function SignUp() {
    const { isDarkMode } = useTheme();
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [enable2FA, setEnable2FA] = useState(false);
    const [twoFactorMethod, setTwoFactorMethod] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleForm = async (e) => {
        e.preventDefault();

        // Validation
        if (!username || !password || !confirmPassword || !email) {
            alert("Please fill in all fields.");
            return;
        }
        if (password.length < 8) {
            alert("Password must be 8 or more characters")
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        if (enable2FA && !twoFactorMethod) {
            alert("Please select a two-factor authentication method.");
            return;
        }
        if (enable2FA && twoFactorMethod === 'SMS' && !phoneNumber) {
            alert("Please enter your phone number for SMS verification.");
            return;
        }

        // Create the user object to send to the backend
        const user = {
            username,
            email,
            password,
            password2: confirmPassword,
            enable_2fa: enable2FA,
            two_factor_method: twoFactorMethod,
            phone_number: enable2FA && twoFactorMethod === 'SMS' ? phoneNumber : null
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                
                if (data.requires_2fa_setup) {
                    // Redirect to 2FA setup page
                    window.location.href = '/two-factor-setup';
                } else {
                    // Redirect to portfolio if no 2FA required
                    window.location.href = '/Portfolio';
                }
            } else {
                setError(data.detail || 'Signup failed');
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
                <form onSubmit={handleForm} className={`flex flex-col items-center justify-center w-[500px] h-auto border ${
                    isDarkMode 
                        ? 'border-black rounded-lg bg-gradient-to-b from-[rgba(14,27,71,0.8)] to-[rgba(33,66,173,0.8)] backdrop-blur-sm opacity-90'
                        : 'border-gray-300 rounded-lg bg-white shadow-lg'
                    } p-6`}>
                    <p className={`text-4xl font-medium mb-5 mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Invest now.</p>

                    <input
                        type="text"
                        placeholder="Enter username"
                        className={`w-[350px] h-[45px] rounded-lg text-xl px-4 mb-6 border-2 ${
                            isDarkMode 
                                ? 'bg-white text-black border-gray-500 placeholder-gray-500'
                                : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                        onChange={(e) => setUsername(e.target.value.trim())}
                    />
                    <input
                        type="email"
                        placeholder="Enter email"
                        className={`w-[350px] h-[45px] rounded-lg text-xl px-4 mb-6 border-2 ${
                            isDarkMode 
                                ? 'bg-white text-black border-gray-500 placeholder-gray-500'
                                : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                        onChange={(e) => setEmail(e.target.value.trim())}
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        className={`w-[350px] h-[45px] rounded-lg text-xl px-4 mb-6 border-2 ${
                            isDarkMode 
                                ? 'bg-white text-black border-gray-500 placeholder-gray-500'
                                : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                        onChange={(e) => setPassword(e.target.value.trim())}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className={`w-[350px] h-[45px] rounded-lg text-xl px-4 mb-6 border-2 ${
                            isDarkMode 
                                ? 'bg-white text-black border-gray-500 placeholder-gray-500'
                                : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500'
                        }`}
                        onChange={(e) => setConfirmPassword(e.target.value.trim())}
                    />
                    <p className={`flex justify-center items-center w-[400px] text-sm text-center font-normal mb-5 ${
                        isDarkMode ? 'text-white' : 'text-gray-600'
                    }`}>*Please ensure your password contains a minimum of 8 characters, including at least 1 uppercase letter and 1 number</p>
                    
                    {/* 2FA Options */}
                    <div className="w-full mb-4 px-6">
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id="enable2FA"
                                checked={enable2FA}
                                onChange={(e) => setEnable2FA(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="enable2FA" className={isDarkMode ? 'text-white' : 'text-gray-800'}>Enable Two-Factor Authentication</label>
                        </div>
                        
                        {enable2FA && (
                            <div className="ml-6">
                                <p className={isDarkMode ? 'text-white mb-2' : 'text-gray-700 mb-2'}>Select 2FA Method:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="email2FA"
                                            name="twoFactorMethod"
                                            value="EMAIL"
                                            checked={twoFactorMethod === "EMAIL"}
                                            onChange={(e) => setTwoFactorMethod(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="email2FA" className={isDarkMode ? 'text-white' : 'text-gray-700'}>Email</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="sms2FA"
                                            name="twoFactorMethod"
                                            value="SMS"
                                            checked={twoFactorMethod === "SMS"}
                                            onChange={(e) => setTwoFactorMethod(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="sms2FA" className={isDarkMode ? 'text-white' : 'text-gray-700'}>SMS</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="totp2FA"
                                            name="twoFactorMethod"
                                            value="TOTP"
                                            checked={twoFactorMethod === "TOTP"}
                                            onChange={(e) => setTwoFactorMethod(e.target.value)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="totp2FA" className={isDarkMode ? 'text-white' : 'text-gray-700'}>Authenticator App</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Phone Number Input */}
                    {twoFactorMethod === 'SMS' && (
                        <div className="mb-2 px-6 w-full">
                            <input
                                type="tel"
                                placeholder="Enter phone number (e.g., +1234567890)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.trim())}
                                className={`w-full h-[45px] rounded-lg text-xl px-4 border-2 ${
                                    isDarkMode 
                                        ? 'bg-white text-black border-gray-500 placeholder-gray-500'
                                        : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500'
                                }`}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`flex justify-center items-center w-[140px] h-[50px] rounded-full text-white font-bold text-xl mb-4 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-[#2011BA] to-[#57D2FF]'
                                : 'bg-gradient-to-r from-blue-600 to-blue-400'
                        }`}
                    >SIGN UP</button>
                    <p className={isDarkMode ? 'text-white text-sm font-normal' : 'text-gray-600 text-sm font-normal'}>
                        Already a member? <Link to="/login"><a href="#" className="underline">Sign in</a></Link>
                    </p>

                    {/* Displaying success or error message */}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </form>
            </div>
        </>
    );
}

