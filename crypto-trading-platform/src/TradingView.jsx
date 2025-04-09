import React, { useState, useEffect } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { Line } from 'react-chartjs-2';
import { cryptoAPI } from './services/cryptoAPI';
import { useTheme } from './ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function TradingView() {
    // Price History States
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [selectedDbCrypto, setSelectedDbCrypto] = useState(null);
    const [timeframe, setTimeframe] = useState('1');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [priceChange, setPriceChange] = useState(null);
    const [high24h, setHigh24h] = useState(null);
    const [low24h, setLow24h] = useState(null);
    
    // Trading States
    const [dbCryptos, setDbCryptos] = useState([]);
    const [amount, setAmount] = useState('');
    const [tradeType, setTradeType] = useState('BUY');
    const [balance, setBalance] = useState(0);
    const [portfolio, setPortfolio] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    
    const { isDarkMode } = useTheme();

    const timeframes = [
        { value: '1', label: '24h' },
        { value: '7', label: '7d' },
        { value: '30', label: '30d' },
        { value: '90', label: '90d' },
        { value: '365', label: '1y' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCrypto) {
            fetchPriceData();
            fetchCurrentData();
            
            // When a new crypto is selected, find the corresponding db crypto
            const matchingDbCrypto = dbCryptos.find(crypto => 
                coins.find(c => 
                    c.id === selectedCrypto && 
                    c.symbol.toLowerCase() === crypto.symbol.toLowerCase()
                )
            );
            
            if (matchingDbCrypto) {
                setSelectedDbCrypto(matchingDbCrypto);
            }
        }
    }, [selectedCrypto, timeframe, dbCryptos, coins]);

    useEffect(() => {
        if (selectedDbCrypto && amount) {
            calculateTotal();
        }
    }, [selectedDbCrypto, amount, currentPrice]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch CoinGecko cryptocurrencies for price data
            const coinsData = await cryptoAPI.getCoins();
            setCoins(coinsData);
            
            // Fetch cryptocurrencies from Django backend or use CoinGecko data
            try {
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
                    const mappedCryptos = coinsData.slice(0, 20).map((coin, index) => ({
                        id: index + 1,
                        name: coin.name,
                        symbol: coin.symbol.toLowerCase(),
                        current_price: coin.current_price
                    }));
                    setDbCryptos(mappedCryptos);
                }
            } catch (error) {
                console.error('Error fetching from backend, using CoinGecko data instead:', error);
                // Map CoinGecko data to expected format for dbCryptos
                const mappedCryptos = coinsData.slice(0, 20).map((coin, index) => ({
                    id: index + 1,
                    name: coin.name,
                    symbol: coin.symbol.toLowerCase(),
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
            setError('Failed to load data');
            setLoading(false);
        }
    };

    const fetchCurrentData = async () => {
        try {
            const data = await cryptoAPI.getCoinData(selectedCrypto);
            const price = data.market_data.current_price.gbp;
            setCurrentPrice(price);
            setPriceChange(data.market_data.price_change_percentage_24h);
            setHigh24h(data.market_data.high_24h.gbp);
            setLow24h(data.market_data.low_24h.gbp);
            
            // Update total cost when price changes
            if (amount) {
                setTotalCost(price * parseFloat(amount));
            }
        } catch (error) {
            console.error('Error fetching current data:', error);
        }
    };

    const fetchPriceData = async () => {
        try {
            const data = await cryptoAPI.getHistoricalData(selectedCrypto, timeframe);
            
            // Format data for chart
            const chartData = {
                labels: data.prices.map(price => 
                    new Date(price[0]).toLocaleString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: 'short'
                    })
                ),
                datasets: [{
                    label: 'Price (GBP)',
                    data: data.prices.map(price => price[1]),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.4
                }]
            };
            
            setPriceData(chartData);
        } catch (error) {
            console.error('Error fetching price data:', error);
        }
    };

    const calculateTotal = () => {
        try {
            if (currentPrice && amount) {
                const total = currentPrice * parseFloat(amount);
                setTotalCost(total);
            }
        } catch (error) {
            console.error('Error calculating total:', error);
        }
    };

    const handleTrade = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedDbCrypto || !amount || amount <= 0) {
            setError('Please fill in all fields with valid values');
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
                cryptocurrency_id: selectedDbCrypto.id,
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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return `£${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    callback: function(value) {
                        return '£' + value.toFixed(2);
                    }
                }
            },
            x: {
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    maxRotation: 45,
                    minRotation: 45
                }
            }
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
                        <h1 className="text-[40px] mb-6">Trade</h1>

                        {/* Top Section: Controls and Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Cryptocurrency Selector */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-4`}>
                                <h2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Select Cryptocurrency</h2>
                                <select
                                    value={selectedCrypto}
                                    onChange={(e) => setSelectedCrypto(e.target.value)}
                                    className={`w-full ${isDarkMode ? 'bg-gray-700/50 text-white' : 'bg-white border border-gray-300 text-gray-900'} px-4 py-2 rounded-lg`}
                                >
                                    {coins.map(coin => (
                                        <option key={coin.id} value={coin.id}>
                                            {coin.name} ({coin.symbol.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Timeframe Selector */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-4`}>
                                <h2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Timeframe</h2>
                                <div className="flex rounded-lg overflow-hidden">
                                    {timeframes.map(tf => (
                                        <button
                                            key={tf.value}
                                            className={`flex-1 px-3 py-2 text-sm ${
                                                timeframe === tf.value
                                                    ? 'bg-blue-600 text-white'
                                                    : `${isDarkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                            }`}
                                            onClick={() => setTimeframe(tf.value)}
                                        >
                                            {tf.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Balance Display */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-4`}>
                                <h2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Available Balance</h2>
                                <p className="text-2xl font-bold">£{balance.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-6 mb-6`}>
                            <div className="h-[350px]">
                                {priceData ? (
                                    <Line data={priceData} options={chartOptions} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-xl">Loading chart data...</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Stats */}
                        {currentPrice && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Current Price</h3>
                                    <p className="text-2xl font-bold">£{currentPrice.toFixed(2)}</p>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>24h Change</h3>
                                    <p className={`text-2xl font-bold ${
                                        priceChange > 0 
                                            ? 'text-green-600 dark:text-green-500' 
                                            : 'text-red-600 dark:text-red-500'
                                    }`}>
                                        {priceChange > 0 ? '+' : ''}{priceChange?.toFixed(2)}%
                                    </p>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>24h High</h3>
                                    <p className="text-2xl font-bold">£{high24h?.toFixed(2)}</p>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>24h Low</h3>
                                    <p className="text-2xl font-bold">£{low24h?.toFixed(2)}</p>
                                </div>
                            </div>
                        )}

                        {/* Trading Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Portfolio Summary */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-6 md:col-span-1`}>
                                <h2 className={`text-xl mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Portfolio</h2>
                                
                                <div className="space-y-2">
                                    {portfolio.length > 0 ? (
                                        <div className="space-y-4">
                                            {portfolio.map((item, index) => {
                                                const crypto = coins.find(c => 
                                                    c.symbol.toLowerCase() === item.cryptocurrency_symbol.toLowerCase()
                                                );
                                                const value = crypto ? crypto.current_price * item.amount : 0;
                                                
                                                return (
                                                    <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium">{item.cryptocurrency_symbol.toUpperCase()}</span>
                                                            <span className={`${crypto?.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                {crypto?.price_change_percentage_24h > 0 ? '+' : ''}{crypto?.price_change_percentage_24h?.toFixed(2) || 0}%
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between mt-2">
                                                            <span>{parseFloat(item.amount).toFixed(6)}</span>
                                                            <span className="font-medium">£{value.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No assets in portfolio yet. Start trading to build your portfolio!
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Trading Form */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-lg'} rounded-lg p-6 md:col-span-2`}>
                                <h2 className={`text-xl mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Trade {selectedDbCrypto ? selectedDbCrypto.name : ''}</h2>
                                
                                <form onSubmit={handleTrade} className="space-y-4">
                                    {/* Trade Type Selection */}
                                    <div className="flex space-x-4 mb-4">
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

                                    {/* Amount Input */}
                                    <div>
                                        <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Amount</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-lg ${
                                                isDarkMode 
                                                    ? 'bg-gray-700/50 text-white border-transparent' 
                                                    : 'bg-white text-gray-900 border border-gray-300'
                                            }`}
                                            placeholder={`Enter amount to ${tradeType.toLowerCase()}`}
                                            min="0"
                                            step="any"
                                            required
                                        />
                                    </div>

                                    {/* Total Cost/Value Display */}
                                    {amount && (
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
                                        {tradeType} {selectedDbCrypto ? selectedDbCrypto.symbol.toUpperCase() : 'Cryptocurrency'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 