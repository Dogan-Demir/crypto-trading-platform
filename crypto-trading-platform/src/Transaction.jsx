import React, { useState, useEffect } from 'react';
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/transactions/', {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            setTransactions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
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
                        <h1 className="text-[40px] mb-6">Transaction History</h1>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Type</th>
                                        <th className="px-6 py-3 text-left">Asset</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                        <th className="px-6 py-3 text-right">Price</th>
                                        <th className="px-6 py-3 text-right">Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="border-t border-gray-700/50">
                                            <td className="px-6 py-4">
                                                {formatDate(transaction.timestamp)}
                                            </td>
                                            <td className={`px-6 py-4 ${
                                                transaction.transaction_type === 'BUY' 
                                                    ? 'text-green-500' 
                                                    : 'text-red-500'
                                            }`}>
                                                {transaction.transaction_type}
                                            </td>
                                            <td className="px-6 py-4">
                                                {transaction.cryptocurrency}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {parseFloat(transaction.amount).toFixed(8)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                £{parseFloat(transaction.price_at_transaction).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                £{(parseFloat(transaction.amount) * 
                                                  parseFloat(transaction.price_at_transaction)).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                                                No transactions found. Start trading to see your history!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}