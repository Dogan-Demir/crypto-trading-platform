import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { Link } from "react-router-dom";
import { useTheme } from './ThemeContext';

export default function Resources() {
    const { isDarkMode } = useTheme();
    
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
                        <h1 className="text-[40px] mb-6">Resources</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Cryptocurrency Basics */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-6 rounded-lg`}>
                                <h2 className="text-xl font-bold mb-4">Cryptocurrency Basics</h2>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• What is cryptocurrency?</li>
                                    <li>• How do cryptocurrencies work?</li>
                                    <li>• Understanding blockchain technology</li>
                                    <li>• Types of cryptocurrencies</li>
                                </ul>
                            </div>

                            {/* Trading Guide */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-6 rounded-lg`}>
                                <h2 className="text-xl font-bold mb-4">Trading Guide</h2>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Basic trading concepts</li>
                                    <li>• Reading charts and analysis</li>
                                    <li>• Trading strategies</li>
                                    <li>• Risk management</li>
                                </ul>
                            </div>

                            {/* Security */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-6 rounded-lg`}>
                                <h2 className="text-xl font-bold mb-4">Security</h2>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Wallet security best practices</li>
                                    <li>• Safe trading tips</li>
                                    <li>• Common scams to avoid</li>
                                    <li>• Two-factor authentication</li>
                                </ul>
                            </div>

                            {/* Market Analysis */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-6 rounded-lg`}>
                                <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Technical analysis basics</li>
                                    <li>• Fundamental analysis</li>
                                    <li>• Market indicators</li>
                                    <li>• Trend analysis</li>
                                </ul>
                            </div>

                            {/* News and Updates */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-6 rounded-lg`}>
                                <h2 className="text-xl font-bold mb-4">News and Updates</h2>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Latest cryptocurrency news</li>
                                    <li>• Market updates</li>
                                    <li>• Regulatory changes</li>
                                    <li>• Industry developments</li>
                                </ul>
                            </div>

                            {/* Community */}
                            <div className={`${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} p-6 rounded-lg`}>
                                <h2 className="text-xl font-bold mb-4">Community</h2>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <li>• Discussion forums</li>
                                    <li>• Trading communities</li>
                                    <li>• Expert insights</li>
                                    <li>• Educational webinars</li>
                                </ul>
                            </div>
                        </div>

                        {/* Additional Resources Button */}
                        <div className="mt-8">
                            <Link to="/Forum" 
                                  className={`inline-block ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-lg transition-colors duration-200`}>
                                Visit Our Forum
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}