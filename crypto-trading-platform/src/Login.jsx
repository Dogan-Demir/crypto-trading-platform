import React from "react";
import { useState } from "react";
import "./CSS/Login.css";

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
          <img src="./assets/logoName.png" alt="logo" className="logo"/>
          <form onSubmit={handleForm} className="login-form">
            <p className="p1">Welcome back!</p>
            <input type="text" placeholder="Enter username" className="username-bar" onChange={(e)=>setUsername(e.target.value.trim())}/>
            <input type="password" placeholder="Enter password" className='password-bar' onChange={(e)=>setPassword(e.target.value.trim())}/>
            <a href="#" className="forgot-btn">Forgot password?</a>
            <button type="submit" className="sign-in">SIGN IN</button>
            <p className="p2">Don't have an account? <a href="#">Sign up</a></p>
          </form>
        </>
    )
}