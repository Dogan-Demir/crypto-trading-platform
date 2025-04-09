import React, { useState, useEffect } from 'react';
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { useTheme } from './ThemeContext';

export default function Deposit() {
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isDarkMode } = useTheme();

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/balance/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBalance(data.balance);
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!amount || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/deposit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Deposit successful!');
                setBalance(data.new_balance);
                setAmount('');
            } else {
                setError(data.detail || 'Deposit failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen bg-lightMode-background dark:bg-[#0F1429]">
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className="min-h-screen text-lightText-primary dark:text-white bg-no-repeat bg-cover relative transition-colors duration-200"
                    style={{ 
                        background: isDarkMode ? `url(${bgImage})` : 'var(--tw-color-lightMode-background, #ffffff)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Deposit Funds</h1>
                        
                        <div className="w-[933px] h-auto border border-gray-200 dark:border-gray-700 rounded-3xl p-6 backdrop-blur-sm bg-lightMode-card dark:bg-gray-800/50 shadow-md">
                            <div className="mb-6">
                                <h2 className="text-2xl mb-2">Current Balance</h2>
                                <p className="text-3xl font-bold">£{balance}</p>
                            </div>

                            <form onSubmit={handleDeposit} className="space-y-4">
                                <div>
                                    <label className="block mb-2">Amount to Deposit (£)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={`w-full p-2 rounded ${isDarkMode 
                                            ? 'bg-gray-700 text-white' 
                                            : 'bg-white border border-gray-300 text-gray-900'}`}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                {error && <div className="text-red-600 dark:text-red-500">{error}</div>}
                                {success && <div className="text-green-600 dark:text-green-500">{success}</div>}

                                <button
                                    type="submit"
                                    className="bg-button-light dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-button-light/90 dark:hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Deposit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 