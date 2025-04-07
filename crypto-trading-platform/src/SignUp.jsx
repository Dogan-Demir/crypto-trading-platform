import React, { useState } from "react";
import bgImage from "./assets/Background-blur.png";
import logo from './assets/logoName.png';
import { Link } from "react-router-dom";


export default function SignUp() {
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
            <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2 text-amber-50">
                <Link to='/'><img src={logo} alt="logo" className="h-8 mr-2" /></Link>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="relative">
                    <img src="./assets/logoName.png" alt="logo" className="absolute top-0 left-0" />
                </div>
                <form onSubmit={handleForm} className="flex flex-col items-center justify-center w-[623px] h-[723px] border border-black rounded-lg bg-gradient-to-b from-[rgba(14,27,71,0.8)] to-[rgba(33,66,173,0.8)] backdrop-blur-sm opacity-90 p-6">
                    <p className="text-white text-[60px] font-medium mb-5 mt-5">Invest now.</p>

                    <input
                        type="text"
                        placeholder="Enter username"
                        className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium-small px-4 mb-9 border-2 border-gray-500"
                        onChange={(e) => setUsername(e.target.value.trim())}
                    />
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium px-4 mb-9"
                        onChange={(e) => setEmail(e.target.value.trim())}
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium-small px-4 mb-9 border-2 border-gray-500"
                        onChange={(e) => setPassword(e.target.value.trim())}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium-small px-4 mb-9 border-2 border-gray-500"
                        onChange={(e) => setConfirmPassword(e.target.value.trim())}
                    />
                    <p className="flex justify-center items-center w-[473px] h-[87px] text-[15px] text-white text-center font-normal mb-7 ">*Please ensure your password contains a minimum of 8 characters, including at least 1 uppercase letter and 1 number</p>
                    
                    {/* 2FA Options */}
                    <div className="w-full mb-6">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="enable2FA"
                                checked={enable2FA}
                                onChange={(e) => setEnable2FA(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="enable2FA" className="text-white">Enable Two-Factor Authentication</label>
                        </div>
                        
                        {enable2FA && (
                            <div className="ml-6">
                                <p className="text-white mb-2">Select 2FA Method:</p>
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
                                        <label htmlFor="email2FA" className="text-white">Email</label>
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
                                        <label htmlFor="sms2FA" className="text-white">SMS</label>
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
                                        <label htmlFor="totp2FA" className="text-white">Authenticator App</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Phone Number Input */}
                    {twoFactorMethod === 'SMS' && (
                        <div className="mb-2">
                            <input
                                type="tel"
                                placeholder="Enter phone number (e.g., +1234567890)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.trim())}
                                className="w-full h-[48px] rounded-lg text-[25px] font-medium-small px-4 border-2 border-gray-500"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex justify-center items-center w-[159px] h-[61px] rounded-full bg-gradient-to-r from-[#2011BA] to-[#57D2FF] text-white font-bold text-[25px] mb-5"
                    >SIGN UP</button>
                    <p className="text-white text-[15px] font-normal">
                        Already a member? <Link to="/login"><a href="#" className="underline">Sign in</a></Link>
                    </p>

                    {/* Displaying success or error message */}
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                </form>
            </div>
        </>
    );
}

