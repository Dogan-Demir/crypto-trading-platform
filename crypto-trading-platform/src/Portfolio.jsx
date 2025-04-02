import React, { useState, useEffect } from 'react';
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { Link } from 'react-router-dom';

export default function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [balance, setBalance] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            // Fetch user's balance
            const balanceResponse = await fetch('http://127.0.0.1:8000/api/balance/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            
            if (!balanceResponse.ok) {
                throw new Error('Failed to fetch balance');
            }
            
            const balanceData = await balanceResponse.json();
            setBalance(parseFloat(balanceData.balance) || 0);

            // Fetch portfolio
            const portfolioResponse = await fetch('http://127.0.0.1:8000/api/portfolio/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });

            if (!portfolioResponse.ok) {
                throw new Error('Failed to fetch portfolio');
            }

            const portfolioData = await portfolioResponse.json();
            
            // Fetch current crypto prices
            const cryptoResponse = await fetch('http://127.0.0.1:8000/api/cryptocurrencies/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });

            if (!cryptoResponse.ok) {
                throw new Error('Failed to fetch cryptocurrencies');
            }

            const cryptoData = await cryptoResponse.json();

            // Combine portfolio data with current prices
            const enrichedPortfolio = portfolioData.map(holding => {
                const crypto = cryptoData.find(c => c.symbol === holding.cryptocurrency_symbol);
                const value = crypto ? parseFloat(holding.amount) * parseFloat(crypto.current_price) : 0;
                return {
                    ...holding,
                    currentPrice: crypto ? parseFloat(crypto.current_price) : 0,
                    value: value,
                    amount: parseFloat(holding.amount)
                };
            });

            setPortfolio(enrichedPortfolio);
            const total = enrichedPortfolio.reduce((sum, item) => sum + (item.value || 0), 0);
            setTotalValue(total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
            setLoading(false);
            setPortfolio([]);
            setTotalValue(0);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                <NavBar2 />
                <div className="ml-[398px] p-8">
                    <h1 className="text-2xl">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0F1429]">
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className="min-h-screen text-white bg-no-repeat bg-cover relative"
                     style={{ 
                         background: `url(${bgImage})`,
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Portfolio Overview</h1>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                                <h3 className="text-gray-400 mb-2">Available Balance</h3>
                                <p className="text-2xl font-bold">£{balance.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                                <h3 className="text-gray-400 mb-2">Portfolio Value</h3>
                                <p className="text-2xl font-bold">£{totalValue.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                                <h3 className="text-gray-400 mb-2">Total Assets</h3>
                                <p className="text-2xl font-bold">£{(balance + totalValue).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Portfolio Table */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Asset</th>
                                        <th className="px-6 py-3 text-right">Holdings</th>
                                        <th className="px-6 py-3 text-right">Price</th>
                                        <th className="px-6 py-3 text-right">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.map((item, index) => (
                                        <tr key={index} className="border-t border-gray-700/50">
                                            <td className="px-6 py-4">
                                                {item.cryptocurrency_symbol}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.amount.toFixed(8)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                £{item.currentPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                £{item.value.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {portfolio.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                                                No assets in portfolio. Start trading to build your portfolio!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex gap-4">
                            <Link 
                                to="/trading"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Trade
                            </Link>
                            <Link 
                                to="/deposit"
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                            >
                                Deposit
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}