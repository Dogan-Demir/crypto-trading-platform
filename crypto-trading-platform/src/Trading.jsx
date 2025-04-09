import React, { useState, useEffect } from 'react';
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { cryptoAPI } from './services/cryptoAPI';
import { useTheme } from './ThemeContext';

export default function Trading() {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [dbCryptos, setDbCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [amount, setAmount] = useState('');
    const [tradeType, setTradeType] = useState('BUY');
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCrypto && amount) {
            calculateTotal();
        }
    }, [selectedCrypto, amount]);

    const fetchData = async () => {
        try {
            // Fetch CoinGecko cryptocurrencies
            const coins = await cryptoAPI.getCoins();
            setCryptocurrencies(coins);
            
            // Fetch cryptocurrencies from Django backend
            const dbResponse = await fetch('http://127.0.0.1:8000/api/cryptocurrencies/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            const dbCryptoData = await dbResponse.json();
            setDbCryptos(dbCryptoData);
            
            // Fetch user's balance
            const balanceResponse = await fetch('http://127.0.0.1:8000/api/balance/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            const balanceData = await balanceResponse.json();
            setBalance(balanceData.balance);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load trading data');
            setLoading(false);
        }
    };

    const calculateTotal = async () => {
        const selectedCoin = cryptocurrencies.find(c => 
            c.symbol.toLowerCase() === dbCryptos.find(dc => dc.id === parseInt(selectedCrypto))?.symbol.toLowerCase()
        );
        if (selectedCoin && amount) {
            const total = selectedCoin.current_price * parseFloat(amount);
            setCurrentPrice(selectedCoin.current_price);
            setTotalCost(total);
        }
    };

    const handleTrade = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedCrypto || !amount || amount <= 0) {
            setError('Please fill in all fields with valid values');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/trade/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    cryptocurrency_id: selectedCrypto,
                    amount: parseFloat(amount),
                    trade_type: tradeType,
                    price: currentPrice
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`${tradeType} order executed successfully!`);
                setAmount('');
                fetchData(); // Refresh balance and data
            } else {
                setError(data.detail || 'Trade failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Trade error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-lightMode-background dark:bg-[#0F1429]">
                <NavBar2 />
                <main className="flex-1 ml-[398px]">
                    <div className="min-h-screen text-lightText-primary dark:text-white p-8">
                        <h1 className="text-2xl">Loading...</h1>
                    </div>
                </main>
            </div>
        );
    }

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
                        <h1 className="text-[40px] mb-6">Trading</h1>

                        {/* Balance Display */}
                        <div className="bg-lightMode-card dark:bg-gray-800/50 shadow-md backdrop-blur-sm rounded-lg p-6 mb-6">
                            <h2 className="text-lightText-secondary dark:text-gray-400 mb-2">Available Balance</h2>
                            <p className="text-2xl font-bold">£{balance.toFixed(2)}</p>
                        </div>

                        {/* Trading Form */}
                        <div className="bg-lightMode-card dark:bg-gray-800/50 shadow-md backdrop-blur-sm rounded-lg p-6">
                            <form onSubmit={handleTrade} className="space-y-6">
                                {/* Trade Type Selection */}
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        type="button"
                                        className={`flex-1 py-3 rounded-lg ${
                                            tradeType === 'BUY'
                                                ? 'bg-green-600 dark:bg-green-600 text-white'
                                                : 'bg-lightMode-secondary dark:bg-gray-700/50 text-lightText-secondary dark:text-gray-300'
                                        }`}
                                        onClick={() => setTradeType('BUY')}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-3 rounded-lg ${
                                            tradeType === 'SELL'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-lightMode-secondary dark:bg-gray-700/50 text-lightText-secondary dark:text-gray-300'
                                        }`}
                                        onClick={() => setTradeType('SELL')}
                                    >
                                        Sell
                                    </button>
                                </div>

                                {/* Cryptocurrency Selection */}
                                <div>
                                    <label className="block text-lightText-secondary dark:text-gray-400 mb-2">Select Cryptocurrency</label>
                                    <select
                                        value={selectedCrypto}
                                        onChange={(e) => setSelectedCrypto(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700/50 text-lightText-primary dark:text-white border border-gray-300 dark:border-transparent px-4 py-2 rounded-lg"
                                        required
                                    >
                                        <option value="">Select a cryptocurrency</option>
                                        {dbCryptos.map(crypto => {
                                            const coinGeckoCrypto = cryptocurrencies.find(c => 
                                                c.symbol.toLowerCase() === crypto.symbol.toLowerCase()
                                            );
                                            return (
                                                <option key={crypto.id} value={crypto.id}>
                                                    {crypto.name} ({crypto.symbol.toUpperCase()}) 
                                                    - £{coinGeckoCrypto?.current_price.toFixed(2) || 'Loading...'}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-lightText-secondary dark:text-gray-400 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700/50 text-lightText-primary dark:text-white border border-gray-300 dark:border-transparent px-4 py-2 rounded-lg"
                                        placeholder="Enter amount"
                                        min="0"
                                        step="any"
                                        required
                                    />
                                </div>

                                {/* Total Cost/Value Display */}
                                {selectedCrypto && amount && (
                                    <div className="p-4 bg-lightMode-secondary/50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-lightText-secondary dark:text-gray-400">Price per unit:</span>
                                            <span>£{currentPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span>Total {tradeType === 'BUY' ? 'Cost' : 'Value'}:</span>
                                            <span>£{totalCost.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error and Success Messages */}
                                {error && <div className="text-red-600 dark:text-red-500 p-3 bg-red-100 dark:bg-red-900/20 rounded">{error}</div>}
                                {success && <div className="text-green-600 dark:text-green-500 p-3 bg-green-100 dark:bg-green-900/20 rounded">{success}</div>}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className={`w-full py-3 rounded-lg font-bold ${
                                        tradeType === 'BUY'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                    } text-white transition-colors duration-200`}
                                >
                                    {tradeType} Cryptocurrency
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 