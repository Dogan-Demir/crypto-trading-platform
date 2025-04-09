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

export default function PriceHistory() {
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [timeframe, setTimeframe] = useState('1');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [priceChange, setPriceChange] = useState(null);
    const [high24h, setHigh24h] = useState(null);
    const [low24h, setLow24h] = useState(null);
    const { isDarkMode } = useTheme();

    const timeframes = [
        { value: '1', label: '24 Hours' },
        { value: '7', label: '7 Days' },
        { value: '30', label: '30 Days' },
        { value: '90', label: '90 Days' },
        { value: '365', label: '1 Year' },
    ];

    useEffect(() => {
        fetchAvailableCoins();
    }, []);

    useEffect(() => {
        if (selectedCrypto) {
            fetchPriceData();
            fetchCurrentData();
        }
    }, [selectedCrypto, timeframe]);

    const fetchAvailableCoins = async () => {
        try {
            const data = await cryptoAPI.getCoins();
            setCoins(data);
        } catch (error) {
            console.error('Error fetching available coins:', error);
        }
    };

    const fetchCurrentData = async () => {
        try {
            const data = await cryptoAPI.getCoinData(selectedCrypto);
            setCurrentPrice(data.market_data.current_price.gbp);
            setPriceChange(data.market_data.price_change_percentage_24h);
            setHigh24h(data.market_data.high_24h.gbp);
            setLow24h(data.market_data.low_24h.gbp);
        } catch (error) {
            console.error('Error fetching current data:', error);
        }
    };

    const fetchPriceData = async () => {
        setLoading(true);
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
            setLoading(false);
        } catch (error) {
            console.error('Error fetching price data:', error);
            setLoading(false);
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
                        <h1 className="text-[40px] mb-6">Price History</h1>

                        {/* Controls */}
                        <div className="flex gap-4 mb-6">
                            <select
                                value={selectedCrypto}
                                onChange={(e) => setSelectedCrypto(e.target.value)}
                                className={`${isDarkMode ? 'bg-gray-800/50 text-white' : 'bg-white border border-gray-300 text-gray-900'} px-4 py-2 rounded-lg`}
                            >
                                {coins.map(coin => (
                                    <option key={coin.id} value={coin.id}>
                                        {coin.name} ({coin.symbol.toUpperCase()})
                                    </option>
                                ))}
                            </select>

                            <div className="flex rounded-lg overflow-hidden">
                                {timeframes.map(tf => (
                                    <button
                                        key={tf.value}
                                        className={`px-4 py-2 ${
                                            timeframe === tf.value
                                                ? 'bg-blue-600 text-white'
                                                : `${isDarkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                        }`}
                                        onClick={() => setTimeframe(tf.value)}
                                    >
                                        {tf.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} rounded-lg p-6`}>
                            <div className="h-[500px]">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-xl">Loading chart data...</div>
                                    </div>
                                ) : priceData ? (
                                    <Line data={priceData} options={chartOptions} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-xl">No price data available</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Stats */}
                        {currentPrice && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Current Price</h3>
                                    <p className="text-2xl font-bold">£{currentPrice.toFixed(2)}</p>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>24h Change</h3>
                                    <p className={`text-2xl font-bold ${
                                        priceChange > 0 
                                            ? 'text-green-600 dark:text-green-500' 
                                            : 'text-red-600 dark:text-red-500'
                                    }`}>
                                        {priceChange > 0 ? '+' : ''}{priceChange?.toFixed(2)}%
                                    </p>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>24h High</h3>
                                    <p className="text-2xl font-bold">£{high24h?.toFixed(2)}</p>
                                </div>
                                <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-4 rounded-lg`}>
                                    <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>24h Low</h3>
                                    <p className="text-2xl font-bold">£{low24h?.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

