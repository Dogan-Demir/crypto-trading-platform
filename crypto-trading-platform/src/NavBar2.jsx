import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logoName.png';
import bgImage from './assets/Background-blur-quarter.png';
import account from './assets/Account-icon.png';
import portfolio from './assets/Wallet-icon.png';
import resources from './assets/Resource-icon.png';
import faqs from './assets/FAQ-icon.png';
import orders from './assets/Order-icon.png';
import priceAlerts from './assets/PriceAlert-icon.png';
import settings from './assets/Settings-icon.png';

export default function Navbar() {
    return (
        <div className="fixed z-10 px-4 py-2 text-amber-50 h-[1024px] w-[398px] bg-no-repeat" style={{ background: `url(${bgImage})` }}>
            <nav className="grid justify-between items-center">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className=" mt-5 ml-5 h-8 mr-2" />
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
                                <img src={portfolio} alt='account' className='ml-4.5 mr-4'/>
                                Portfolio
                            </Link>
                        </li>
                        <li>
                            <Link to="/Resources" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={resources} alt='account' className='ml-4.5 mr-4'/>
                                Resources
                            </Link>
                        </li>
                        <li>
                            <Link to="/FAQs" className="flex items-center text-xl hover:text-blue-500  mt-[32px]">
                                <img src={faqs} alt='account' className='ml-5 mr-4.5'/>
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="/Orders" className="flex items-center text-xl hover:text-blue-500  mt-[32px]">
                                <img src={orders} alt='account' className='ml-4.5 mr-4'/>
                                Orders
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={priceAlerts} alt='account' className='ml-6 mr-5'/>
                                Price Alerts
                            </a>
                        </li>
                        <li>
                            <Link to="/Settings" className="flex items-center text-xl hover:text-blue-500 mt-[32px]">
                                <img src={settings} alt='account' className='ml-5.5 mr-5'/>
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
