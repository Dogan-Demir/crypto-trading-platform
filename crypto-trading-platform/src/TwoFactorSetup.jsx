import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from "./assets/Background-blur.png";
import logo from './assets/logoName.png';

export default function TwoFactorSetup() {
    const [method, setMethod] = useState(null);
    const [qrCode, setQrCode] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get the user's 2FA method from the backend
        const fetch2FAMethod = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/2fa/method/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setMethod(data.method);
                    if (data.method === 'TOTP' && data.qr_code) {
                        setQrCode(data.qr_code);
                    }
                } else {
                    setError(data.detail || 'Failed to get 2FA method');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            }
        };

        fetch2FAMethod();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/2fa/verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ token })
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/Portfolio');
            } else {
                setError(data.detail || 'Verification failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <>
            <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2 text-amber-50">
                <img src={logo} alt="logo" className="h-8 mr-2" />
            </div>
            <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" 
                 style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="bg-black/50 backdrop-blur-lg p-8 rounded-lg w-96">
                    <h2 className="text-2xl text-white mb-4">Two-Factor Authentication Setup</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    
                    {method === 'TOTP' && (
                        <>
                            <div className="mb-4">
                                <p className="text-white mb-2">1. Install an authenticator app (like Google Authenticator or Authy) on your phone</p>
                                <p className="text-white mb-2">2. Scan the QR code below with the app</p>
                                {qrCode && (
                                    <div className="flex justify-center mb-4">
                                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                                    </div>
                                )}
                                <p className="text-white mb-2">3. Enter the 6-digit code from the app</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                >
                                    Verify
                                </button>
                            </form>
                        </>
                    )}

                    {method === 'EMAIL' && (
                        <>
                            <div className="mb-4">
                                <p className="text-white mb-2">We've sent a verification code to your email address.</p>
                                <p className="text-white mb-2">Please enter the code below to complete the setup.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                >
                                    Verify
                                </button>
                            </form>
                        </>
                    )}

                    {method === 'SMS' && (
                        <>
                            <div className="mb-4">
                                <p className="text-white mb-2">We've sent a verification code to your phone number.</p>
                                <p className="text-white mb-2">Please enter the code below to complete the setup.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                >
                                    Verify
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
} 