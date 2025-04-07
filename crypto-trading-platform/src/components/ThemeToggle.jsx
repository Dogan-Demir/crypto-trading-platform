import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none transition-colors duration-200"
            aria-label="Toggle dark mode"
        >
            <div
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white dark:bg-gray-300 transform transition-transform duration-200 shadow-md ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
            />
            <span className={`absolute text-xs text-gray-500 dark:text-gray-400 ${
                isDarkMode ? 'left-1.5' : 'right-1.5'
            } top-1.5`}>
                {isDarkMode ? '🌙' : '☀️'}
            </span>
        </button>
    );
};

export default ThemeToggle; 