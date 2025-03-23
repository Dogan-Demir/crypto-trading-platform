import bgImage from "./assets/Background-blur.png";
import logo from "./assets/logoName.png";
import {Link} from "react-router-dom";
import React, { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const handleForm = (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }
        console.log("Logging in...");
    }

    return (
        <>
        <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2 text-amber-50">
        <img src={logo} alt="logo" className="h-8 mr-2" />
        </div>
        <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
            <form onSubmit={handleForm} className="flex flex-col items-center justify-center w-[623px] h-[623px] border border-black rounded-lg bg-gradient-to-b from-[rgba(14,27,71,0.8)] to-[rgba(33,66,173,0.8)] backdrop-blur-sm opacity-90 p-6">
                <p className="text-white text-[60px] font-medium mb-9 mt-14">Welcome back!</p>
                <input 
                    type="text" 
                    placeholder="Enter username" 
                    className="w-[409px] h-[48px] rounded-lg text-[25px] font-medium-small px-4 mb-9 bg-white border-2 border-gray-500" 
                    onChange={(e) => setUsername(e.target.value.trim())} 
                />
                <input 
                    type="password" 
                    placeholder="Enter password" 
                    className="w-[409px] h-[48px] rounded-lg text-[25px] font-medium-small px-4 mb-9 bg-white border-2 border-gray-500" 
                    onChange={(e) => setPassword(e.target.value.trim())} 
                />
                <button 
                    type="submit" 
                    className="flex justify-center items-center w-[159px] h-[61px] rounded-full bg-gradient-to-r from-[#2011BA] to-[#57D2FF] text-white font-bold text-[25px] mb-12"
                >SIGN IN</button>
                <p className="text-white text-[20px] font-normal">
                    <a href = "#" className="underline">Forgot Username or Password?</a>
                </p>
                <p className="text-white text-[20px] font-normal">
                    Don't have an account? <Link to="/signup"><a href="#" className="underline">Sign up</a></Link>
                </p>
            </form>
        </div>
        </>
    );
}
