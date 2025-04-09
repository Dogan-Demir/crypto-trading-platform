import { Link } from "react-router-dom";
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function Navbar() {
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed top-5 left-5 right-5 z-10 px-4 py-2 rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <nav className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link to={isAuthenticated ? '/Portfolio' : '/'} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="font-bold text-xl ml-2 tracking-wide">CRYPTYX</span>
                    </Link>
                </div>
                <div className="flex items-center">
                    <ul className="flex items-center space-x-6 mr-4">
                        <li>
                            <Link to={isAuthenticated ? "/Resources" : "/ResourcesNonMember"} className={`text-lg hover:text-blue-600 transition-colors duration-200 ${isDarkMode ? 'text-white hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'}`}>
                                Explore resources
                            </Link>
                        </li>
                        <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>|</p>
                        <li>
                            <Link to={isAuthenticated ? "/FAQs" : "/FAQsNonMember"} className={`text-lg hover:text-blue-600 transition-colors duration-200 ${isDarkMode ? 'text-white hover:text-blue-500' : 'text-gray-800 hover:text-blue-600'}`}>
                                FAQs
                            </Link>
                        </li>
                    </ul>
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
