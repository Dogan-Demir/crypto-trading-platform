import React from "react";
import { useState } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from "./ThemeContext";

export default function Settings() {
    const [select2FAs, setSelected2FA] = useState('Email');
    const [selectPA, setSelectedPA] = useState('Email');
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
                        <h1 className="text-[40px] mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </h1>
                        <div className={`w-[933px] h-[282px] border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-3xl mt-[23px] ml-[53px] ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'}`}>
                            <p className="text-[30px] mt-[23px] ml-[23px] flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Details
                            </p>
                            <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-[13px]`} />
                            <div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[119px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Public ID
                                </p>
                                <p className="">ABC123</p>
                              </div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[149px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                </p>
                                <p className="">ABC123@outlook.com</p>
                                <button className={`w-[87px] h-[41px] rounded-3xl ml-[400px] border ${isDarkMode ? 'border-gray-600 hover:bg-blue-600 hover:text-white' : 'border-gray-300 hover:bg-blue-600 hover:text-white'} transition-colors duration-200`}>
                                  <a href="#" className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit
                                  </a>
                                </button>
                              </div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[140px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Phone
                                </p>
                                <p className="">+44 7771 123123</p>
                                <button className={`w-[87px] h-[41px] rounded-3xl ml-[446px] border ${isDarkMode ? 'border-gray-600 hover:bg-blue-600 hover:text-white' : 'border-gray-300 hover:bg-blue-600 hover:text-white'} transition-colors duration-200`}>
                                  <a href="#" className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit
                                  </a>
                                </button>
                              </div>
                            </div>
                        </div>

                        <div className={`w-[933px] h-[382px] border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-3xl mt-[23px] ml-[53px] ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'}`}>
                            <p className="text-[30px] mt-[23px] ml-[23px] flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Preferences
                            </p>
                            <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-[13px]`} />
                            <div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[179px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    2FA
                                </p>
                                <button className={`w-[87px] h-[41px] border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-3xl mr-[30px] ${select2FAs==='Email'? "bg-blue-600 text-white":""}`} onClick={()=>setSelected2FA('Email')}>Email</button>
                                <button className={`w-[87px] h-[41px] border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-3xl mr-[30px] ${select2FAs==='Push'? "bg-blue-600 text-white":""}`} onClick={()=>setSelected2FA('Push')}>Push</button>
                                <button className={`w-[87px] h-[41px] border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-3xl mr-[30px] ${select2FAs==='SMS'? "bg-blue-600 text-white":""}`} onClick={()=>setSelected2FA('SMS')}>SMS</button>
                              </div>
                            </div>
                            <div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[125px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Price Alert
                                </p>
                                <button className={`w-[87px] h-[41px] border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-3xl mr-[30px] ${selectPA==='Email'? "bg-blue-600 text-white":""}`} onClick={()=>setSelectedPA('Email')}>Email</button>
                                <button className={`w-[87px] h-[41px] border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-3xl mr-[30px] ${selectPA==='Push'? "bg-blue-600 text-white":""}`} onClick={()=>setSelectedPA('Push')}>Push</button>
                                <button className={`w-[87px] h-[41px] border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-3xl mr-[30px] ${selectPA==='SMS'? "bg-blue-600 text-white":""}`} onClick={()=>setSelectedPA('SMS')}>SMS</button>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[123px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    Theme Mode
                                </p>
                                <div className="flex items-center">
                                  <span className={`mr-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Light</span>
                                  <ThemeToggle />
                                  <span className={`ml-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dark</span>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}