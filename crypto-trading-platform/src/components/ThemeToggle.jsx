import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="relative">
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-full focus:outline-none transition-all duration-500 overflow-hidden ${
                    isDarkMode ? 'bg-gray-700' : 'bg-blue-100'
                }`}
                aria-label="Toggle dark mode"
                style={{ transform: isDarkMode ? 'rotate(0deg)' : 'rotate(100deg)' }}
            >
                <div className="relative">
                    {/* Sun icon - fades in/out with opacity */}
                    <div className={`absolute top-0 left-0 transition-opacity duration-500 ${
                        isDarkMode ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 text-yellow-300"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                            />
                        </svg>
                    </div>
                    
                    {/* Moon icon - fades in/out with opacity */}
                    <div className={`transition-opacity duration-500 ${
                        isDarkMode ? 'opacity-0' : 'opacity-100'
                    }`}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 text-blue-800"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                            />
                        </svg>
                    </div>
                </div>
            </button>
            
            {/* Animation effect - ripple */}
            <div 
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-transform duration-1000 ${
                    isDarkMode ? 'scale-0' : 'scale-150'
                } pointer-events-none`}
                style={{
                    background: isDarkMode ? 
                        'radial-gradient(circle, rgba(30,41,59,0) 0%, rgba(30,41,59,0.8) 100%)' : 
                        'radial-gradient(circle, rgba(219,234,254,0) 0%, rgba(219,234,254,0.8) 100%)',
                    transformOrigin: 'center'
                }}
            />
        </div>
    );
};

export default ThemeToggle; 