import React, { useState, useEffect } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('open');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${activeTab}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-green-500';
            case 'cancelled':
                return 'text-red-500';
            case 'pending':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#0F1429]">
                <NavBar2 />
                <main className="flex-1 ml-[398px]">
                    <div className="min-h-screen text-white p-8">
                        <h1 className="text-2xl">Loading...</h1>
                    </div>
                </main>
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
                        <h1 className="text-[40px] mb-6">Orders</h1>

                        {/* Tab Navigation */}
                        <div className="flex space-x-4 mb-6">
                            <button
                                className={`px-6 py-2 rounded-lg ${
                                    activeTab === 'open'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}
                                onClick={() => setActiveTab('open')}
                            >
                                Open Orders
                            </button>
                            <button
                                className={`px-6 py-2 rounded-lg ${
                                    activeTab === 'history'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}
                                onClick={() => setActiveTab('history')}
                            >
                                Order History
                            </button>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Type</th>
                                        <th className="px-6 py-3 text-left">Asset</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                        <th className="px-6 py-3 text-right">Price</th>
                                        <th className="px-6 py-3 text-right">Total</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map((order, index) => (
                                            <tr key={index} className="border-t border-gray-700/50">
                                                <td className="px-6 py-4">{formatDate(order.date)}</td>
                                                <td className={`px-6 py-4 ${
                                                    order.type === 'BUY' ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                    {order.type}
                                                </td>
                                                <td className="px-6 py-4">{order.asset}</td>
                                                <td className="px-6 py-4 text-right">{order.amount}</td>
                                                <td className="px-6 py-4 text-right">£{order.price}</td>
                                                <td className="px-6 py-4 text-right">£{order.total}</td>
                                                <td className={`px-6 py-4 text-center ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                                                No orders found
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