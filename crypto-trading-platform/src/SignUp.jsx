import React from "react";
import bgImage from "./assets/Background-blur.png";
import { useState } from "react";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
        
    const handleForm = (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword){
            alert("Passwords do not match.");
            return;
        }
        console.log("Logging in...");
    }
    
    return(
        <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="relative">
                <img src="./assets/logoName.png" alt="logo" className="absolute top-0 left-0" />
            </div>
            <form onSubmit={handleForm} className="flex flex-col items-center justify-center w-[623px] h-[623px] border border-black rounded-lg bg-gradient-to-b from-[rgba(14,27,71,0.8)] to-[rgba(33,66,173,0.8)] backdrop-blur-sm opacity-90 p-6">
                <p className="text-white text-[60px] font-medium mb-5 mt-9">Invest now.</p>
                <input 
                    type="text" 
                    placeholder="Enter username" 
                    className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium px-4 mb-9" 
                    onChange={(e) => setUsername(e.target.value.trim())} 
                />
                <input 
                    type="password" 
                    placeholder="Enter password" 
                    className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium px-4 mb-9" 
                    onChange={(e) => setPassword(e.target.value.trim())} 
                />
                <input 
                    type="password" 
                    placeholder="Confirm password" 
                    className="bg-white w-[409px] h-[48px] rounded-lg text-[25px] font-medium px-4 mb-9" 
                    onChange={(e) => setConfirmPassword(e.target.value.trim())} 
                />
                <p className="flex justify-center items-center w-[473px] h-[87px] text-[25px] text-white text-center font-normal mb-9">*Please ensure your password contains a minimum of 8 characters, including at least 1 uppercase letter and 1 number</p>
                <button 
                    type="submit" 
                    className="flex justify-center items-center w-[159px] h-[61px] rounded-full bg-gradient-to-r from-[#2011BA] to-[#57D2FF] text-white font-bold text-[25px] mb-5"
                >SIGN UP</button>
                <p className="text-white text-[20px] font-normal">
                    Already a member? <a href="#" className="no-underline">SIGN IN</a>
                </p>
            </form>
        </div>
    )
}