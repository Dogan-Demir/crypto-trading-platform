import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { useTheme } from "./ThemeContext";

export default function Account() {
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#0F1429]' : 'bg-gray-100'}`}>
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'} bg-no-repeat bg-cover relative transition-colors duration-200`}
                     style={{ 
                         background: isDarkMode ? `url(${bgImage})` : undefined,
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Account</h1>
                        <div className={`w-[933px] h-[325px] ${isDarkMode ? 'border-gray-700 bg-black/20' : 'border-gray-200 bg-white'} border rounded-3xl mt-[23px] ml-[53px] shadow-lg`}>
                            {/* Account content will go here */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}