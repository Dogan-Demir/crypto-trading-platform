import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { useTheme } from "./ThemeContext";

export default function Account() {
    const { isDarkMode } = useTheme();
    
    return (
        <div className="flex min-h-screen bg-lightMode-background dark:bg-[#0F1429]">
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className="min-h-screen text-lightText-primary dark:text-white bg-no-repeat bg-cover relative transition-colors duration-200"
                     style={{ 
                         background: isDarkMode ? `url(${bgImage})` : 'var(--tw-color-lightMode-background, #ffffff)',
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Account</h1>
                        <div className="w-[933px] h-[325px] border border-gray-300 dark:border rounded-3xl mt-[23px] ml-[53px] bg-lightMode-card dark:bg-black/20 shadow-md"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}