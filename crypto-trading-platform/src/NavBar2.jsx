import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logoName.png';
import bgImage from './assets/Background-blur-quarter.png';
import account from './assets/Account-icon.png';
import portfolio from './assets/Wallet-icon.png';
import transaction from './assets/Transaction-icon.png';
import resources from './assets/Resource-icon.png';
import faqs from './assets/FAQ-icon.png';
import orders from './assets/Order-icon.png';
import priceAlerts from './assets/PriceAlert-icon.png';
import settings from './assets/Settings-icon.png';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log('Logout initiated');
        try {
            // Call Django logout endpoint
            const response = await fetch('http://127.0.0.1:8000/api/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Logout response:', response);

            if (response.ok) {
                console.log('Logout successful');
                // Clear the authentication token
                localStorage.removeItem('token');
                // Force a page reload to clear any cached state
                window.location.href = '/';
            } else {
                console.error('Logout failed:', await response.text());
                // Fallback: clear token and redirect anyway
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback: clear token and redirect anyway
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    return (
        <div className="fixed z-10 px-4 py-2 text-amber-50 h-[1024px] w-[398px] bg-no-repeat" style={{ background: `url(${bgImage})` }}>
            <nav className="grid justify-between items-center">
                <div className="flex items-center">
                    <Link to='/'><img src={logo} alt="Logo" className=" mt-5 ml-5 h-8 mr-2" /></Link>
                </div>
                <div>
                    <ul className="items-center">
                        <li>
                            <Link to="/Account" className="flex items-center text-xl hover:text-blue-500 mt-[61px]">
                                <img src={account} alt='account' className='ml-5.5 mr-5'/>
                                Account
                            </Link>
                        </li>
                        <li>
                            <Link to="/Portfolio" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={portfolio} alt='portfolio' className='ml-4.5 mr-4'/>
                                Portfolio
                            </Link>
                        </li>
                        <li>
                            <Link to="/Transaction" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={transaction} alt='transaction' className='ml-4.5 mr-4'/>
                                Transactions
                            </Link>
                        </li>
                        <li>
                            <Link to="/Resources" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={resources} alt='resources' className='ml-4.5 mr-4'/>
                                Resources
                            </Link>
                        </li>
                        <li>
                            <Link to="/FAQs" className="flex items-center text-xl hover:text-blue-500  mt-[32px]">
                                <img src={faqs} alt='FAQs' className='ml-5 mr-4.5'/>
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="/Orders" className="flex items-center text-xl hover:text-blue-500  mt-[32px]">
                                <img src={orders} alt='orders' className='ml-4.5 mr-4'/>
                                Orders
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={priceAlerts} alt='price Alerts' className='ml-6 mr-5'/>
                                Price Alerts
                            </a>
                        </li>
                        <li>
                            <Link to="/Settings" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={settings} alt='settings' className='ml-5.5 mr-5'/>
                                Settings
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-4 p-2 bg-red-600 hover:bg-red-700 rounded text-white mt-[32px]"
                            >
                                <span className="text-lg">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
