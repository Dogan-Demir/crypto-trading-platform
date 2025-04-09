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
    const [portfolio, setPortfolio] = useState([]);
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
            
            try {
                // Fetch cryptocurrencies from Django backend
                const dbResponse = await fetch('http://127.0.0.1:8000/api/cryptocurrencies/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                
                if (!dbResponse.ok) {
                    throw new Error('Failed to fetch cryptocurrencies from backend');
                }
                
                const dbCryptoData = await dbResponse.json();
                if (dbCryptoData && dbCryptoData.length > 0) {
                    setDbCryptos(dbCryptoData);
                } else {
                    // If backend returns empty data, create our own DB cryptos from CoinGecko data
                    const mappedCryptos = coins.slice(0, 20).map((coin, index) => ({
                        id: index + 1,
                        name: coin.name,
                        symbol: coin.symbol,
                        current_price: coin.current_price
                    }));
                    setDbCryptos(mappedCryptos);
                }
            } catch (error) {
                console.error('Error fetching from backend, using CoinGecko data instead:', error);
                // Map CoinGecko data to expected format for dbCryptos
                const mappedCryptos = coins.slice(0, 20).map((coin, index) => ({
                    id: index + 1,
                    name: coin.name,
                    symbol: coin.symbol,
                    current_price: coin.current_price
                }));
                setDbCryptos(mappedCryptos);
            }
            
            // Fetch user's balance
            try {
                const balanceResponse = await fetch('http://127.0.0.1:8000/api/balance/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                
                if (!balanceResponse.ok) {
                    throw new Error('Failed to fetch balance from backend');
                }
                
                const balanceData = await balanceResponse.json();
                setBalance(balanceData.balance);
            } catch (error) {
                console.error('Error fetching balance, using localStorage:', error);
                const storedBalance = localStorage.getItem('userBalance');
                if (storedBalance) {
                    setBalance(parseFloat(storedBalance));
                } else {
                    // Default balance if nothing in localStorage
                    localStorage.setItem('userBalance', '10000');
                    setBalance(10000);
                }
            }
            
            // Fetch user's portfolio
            try {
                const portfolioData = await cryptoAPI.getUserPortfolio();
                setPortfolio(portfolioData);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
                setPortfolio([]);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load trading data');
            setLoading(false);
        }
    };

    const calculateTotal = async () => {
        try {
            const selectedDbCrypto = dbCryptos.find(dc => dc.id === parseInt(selectedCrypto));
            if (!selectedDbCrypto) return;
            
            const selectedCoin = cryptocurrencies.find(c => 
                c.symbol.toLowerCase() === selectedDbCrypto.symbol.toLowerCase()
            );
            
            if (selectedCoin && amount) {
                const total = selectedCoin.current_price * parseFloat(amount);
                setCurrentPrice(selectedCoin.current_price);
                setTotalCost(total);
            } else {
                console.warn('Selected coin not found in market data, using default pricing');
                // Use a fallback price if coin not found
                setCurrentPrice(1000); // Default price
                setTotalCost(1000 * parseFloat(amount || 0));
            }
        } catch (error) {
            console.error('Error calculating total:', error);
            // Use fallback values on error
            setCurrentPrice(1000);
            setTotalCost(1000 * parseFloat(amount || 0));
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

        // Get selected cryptocurrency data
        const selectedDbCrypto = dbCryptos.find(dc => dc.id === parseInt(selectedCrypto));
        if (!selectedDbCrypto) {
            setError('Selected cryptocurrency not found');
            return;
        }

        // For SELL orders, check if user has enough of the cryptocurrency
        if (tradeType === 'SELL') {
            try {
                const portfolio = await cryptoAPI.getUserPortfolio();
                const holding = portfolio.find(
                    item => item.cryptocurrency_symbol.toLowerCase() === selectedDbCrypto.symbol.toLowerCase()
                );
                
                if (!holding || parseFloat(holding.amount) < parseFloat(amount)) {
                    setError(`You don't have enough ${selectedDbCrypto.symbol.toUpperCase()} to sell. Current balance: ${holding ? holding.amount : 0}`);
                    return;
                }
            } catch (err) {
                console.error('Error checking portfolio:', err);
            }
        }

        try {
            // Use the cryptoAPI service to execute the trade
            const tradeData = {
                cryptocurrency_id: selectedCrypto,
                amount: parseFloat(amount),
                trade_type: tradeType,
                price: currentPrice || 0,
                currency: selectedDbCrypto.symbol.toLowerCase() // Add the symbol for local storage fallback
            };
            
            await cryptoAPI.executeTrade(tradeData);
            
            setSuccess(`${tradeType} order executed successfully!`);
            setAmount('');
            
            // Refresh balance and data
            fetchData();
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
            console.error('Trade error:', err);
        }
    };

    if (loading) {
        return (
            <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#0F1429]' : 'bg-gray-100'}`}>
                <NavBar2 />
                <main className="flex-1 ml-[398px]">
                    <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'} p-8`}>
                        <h1 className="text-2xl">Loading...</h1>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#0F1429]' : 'bg-gray-100'}`}>
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'} bg-no-repeat bg-cover relative`}
                     style={{ 
                         background: isDarkMode ? `url(${bgImage})` : undefined,
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Trading</h1>

                        {/* Balance and Portfolio Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Balance Display */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-6`}>
                                <h2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Available Balance</h2>
                                <p className="text-2xl font-bold">£{balance.toFixed(2)}</p>
                            </div>
                            
                            {/* Portfolio Summary */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-6`}>
                                <h2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Portfolio Summary</h2>
                                {portfolio.length > 0 ? (
                                    <div className="space-y-2">
                                        {portfolio.map((item, index) => {
                                            const crypto = cryptocurrencies.find(c => 
                                                c.symbol.toLowerCase() === item.cryptocurrency_symbol.toLowerCase()
                                            );
                                            const value = crypto ? crypto.current_price * item.amount : 0;
                                            
                                            return (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span>{item.cryptocurrency_symbol.toUpperCase()}</span>
                                                    <span className="font-medium">{parseFloat(item.amount).toFixed(6)} (£{value.toFixed(2)})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p>No assets in portfolio</p>
                                )}
                            </div>
                        </div>

                        {/* Trading Form */}
                        <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-6`}>
                            <form onSubmit={handleTrade} className="space-y-6">
                                {/* Trade Type Selection */}
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        type="button"
                                        className={`flex-1 py-3 rounded-lg ${
                                            tradeType === 'BUY'
                                                ? 'bg-green-600 text-white'
                                                : `${isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-700'}`
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
                                                : `${isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                                        }`}
                                        onClick={() => setTradeType('SELL')}
                                    >
                                        Sell
                                    </button>
                                </div>

                                {/* Cryptocurrency Selection */}
                                <div>
                                    <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Select Cryptocurrency</label>
                                    <select
                                        value={selectedCrypto}
                                        onChange={(e) => setSelectedCrypto(e.target.value)}
                                        className={`w-full px-4 py-2 rounded-lg ${
                                            isDarkMode 
                                                ? 'bg-gray-700/50 text-white border-transparent' 
                                                : 'bg-white text-gray-900 border border-gray-300'
                                        }`}
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
                                    <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Amount</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={`w-full px-4 py-2 rounded-lg ${
                                            isDarkMode 
                                                ? 'bg-gray-700/50 text-white border-transparent' 
                                                : 'bg-white text-gray-900 border border-gray-300'
                                        }`}
                                        placeholder="Enter amount"
                                        min="0"
                                        step="any"
                                        required
                                    />
                                </div>

                                {/* Total Cost/Value Display */}
                                {selectedCrypto && amount && (
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                        <div className="flex justify-between mb-2">
                                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price per unit:</span>
                                            <span>£{currentPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span>Total {tradeType === 'BUY' ? 'Cost' : 'Value'}:</span>
                                            <span>£{totalCost.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error and Success Messages */}
                                {error && <div className={`p-3 rounded ${isDarkMode ? 'bg-red-900/20 text-red-500' : 'bg-red-100 text-red-600'}`}>{error}</div>}
                                {success && <div className={`p-3 rounded ${isDarkMode ? 'bg-green-900/20 text-green-500' : 'bg-green-100 text-green-600'}`}>{success}</div>}

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