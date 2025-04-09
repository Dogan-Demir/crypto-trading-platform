import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from './assets/Background-blur-quarter.png';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './ThemeContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const bgColor = isDarkMode ? "transparent" : "#ffffff";
    const hoverColor = isDarkMode ? "#3b82f6" : "#2960e6";
    const iconColor = isDarkMode ? "#ffffff" : "#000000";
    
    const navStyle = {
        position: 'fixed',
        zIndex: 10,
        padding: '8px 16px',
        height: '1024px',
        width: '398px',
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: isDarkMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s',
        backgroundImage: isDarkMode ? `url(${bgImage})` : 'none'
    };
    
    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.25rem',
        color: textColor,
        marginTop: '32px'
    };
    
    const firstLinkStyle = {
        ...linkStyle,
        marginTop: '61px'
    };
    
    const iconStyle = {
        width: '24px',
        height: '24px',
        marginRight: '16px',
        marginLeft: '20px'
    };
    
    const logoutStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '8px',
        backgroundColor: '#dc2626',
        color: 'white',
        marginTop: '32px',
        borderRadius: '4px',
        transition: 'all 0.2s'
    };
    
    const handleLinkHover = (e) => {
        e.currentTarget.style.color = hoverColor;
    };
    
    const handleLinkLeave = (e) => {
        e.currentTarget.style.color = textColor;
    };
    
    const handleLogoutHover = (e) => {
        e.currentTarget.style.backgroundColor = '#b91c1c';
    };
    
    const handleLogoutLeave = (e) => {
        e.currentTarget.style.backgroundColor = '#dc2626';
    };

    const handleLogout = async () => {
        console.log('Logout initiated');
        try {
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
                localStorage.removeItem('token');
                window.location.href = '/';
            } else {
                console.error('Logout failed:', await response.text());
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    return (
        <div style={navStyle}>
            <nav>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: '20px', marginLeft: '20px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span style={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.5rem', 
                            marginLeft: '8px', 
                            color: textColor,
                            letterSpacing: '1px'
                        }}>
                            CRYPTYX
                        </span>
                    </Link>
                    <div style={{ marginTop: '20px', marginRight: '20px' }}>
                        <ThemeToggle />
                    </div>
                </div>
                <div>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li>
                            <Link 
                                to="/Account" 
                                style={firstLinkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span style={{ color: textColor }}>Account</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/Portfolio" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                                <span style={{ color: textColor }}>Portfolio</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/Transaction" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <span style={{ color: textColor }}>Transactions</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/Resources" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span style={{ color: textColor }}>Resources</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/FAQs" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span style={{ color: textColor }}>FAQs</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/Orders" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span style={{ color: textColor }}>Orders</span>
                            </Link>
                        </li>
                        <li>
                            <a 
                                href="#" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span style={{ color: textColor }}>Price Alerts</span>
                            </a>
                        </li>
                        <li>
                            <Link 
                                to="/Settings" 
                                style={linkStyle} 
                                onMouseEnter={handleLinkHover} 
                                onMouseLeave={handleLinkLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span style={{ color: textColor }}>Settings</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                style={logoutStyle}
                                onMouseEnter={handleLogoutHover}
                                onMouseLeave={handleLogoutLeave}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" style={{width: '20px', height: '20px', marginRight: '8px'}} fill="none" viewBox="0 0 24 24" stroke="white">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span style={{ fontSize: '1.125rem' }}>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
