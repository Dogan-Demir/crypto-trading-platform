import {Link} from "react-router-dom";
import bgImage from "./assets/Background-blur.png";
import Navbar from "./Navbar";
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

function LandingPage() {
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();

    return (
        <div 
            className={`min-h-screen flex items-center justify-start bg-cover bg-no-repeat ${
                isDarkMode 
                    ? 'from-black/26 to-black/26 border border-black'
                    : 'from-gray-100 to-gray-100 border border-gray-300'
            }`} 
            style={{ 
                backgroundImage: isDarkMode ? `url(${bgImage})` : 'none',
                backgroundColor: isDarkMode ? undefined : '#f3f4f6' 
            }}
        >
            <Navbar />
            {/* Left side content with blur background */}
            <div className={`relative w-1/2 min-h-screen p-8 ${
                isDarkMode 
                    ? 'bg-black/50 backdrop-blur-lg' 
                    : 'bg-white/80 shadow-lg'
                } flex flex-col justify-center`}
            >
                {/* Headings */}
                <h1 className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-left mt-10`}>CRYPTO YOU CAN</h1>
                <h1 className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-left`}>COUNT ON</h1>

                {/* Subtitle */}
                <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-700'} text-left mt-4 px-4 md:px-0`}>
                    Buy and sell a range of cryptocurrency assets on our secure and reliable platform from anytime, anywhere.
                </h3>

                {/* Buttons */}
                <div className="flex space-x-4 mt-8">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login">
                                <button className={`px-6 py-3 rounded-full transition duration-300 ${
                                    isDarkMode 
                                        ? 'bg-[#091267] text-white border border-white hover:bg-[#0a1b4c]' 
                                        : 'bg-blue-800 text-white hover:bg-blue-900'
                                }`}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className={`px-6 py-3 text-white rounded-full transition duration-300 ${
                                    isDarkMode
                                        ? 'bg-gradient-to-r from-[#2011BA] to-[#57D2FF] hover:from-[#3b2ee0] hover:to-[#3fd2f1]'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500'
                                }`}>
                                    Sign up
                                </button>
                            </Link>
                        </>
                    ) : (
                        <Link to="/Portfolio">
                            <button className={`px-6 py-3 text-white rounded-full transition duration-300 ${
                                isDarkMode
                                    ? 'bg-gradient-to-r from-[#2011BA] to-[#57D2FF] hover:from-[#3b2ee0] hover:to-[#3fd2f1]'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500'
                            }`}>
                                Go to Portfolio
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
