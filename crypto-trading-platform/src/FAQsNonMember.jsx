import React from "react";
import { useState } from "react";
import NavBar from "./Navbar";
import bgImage from "./assets/Background-long.png";
import icon from './assets/FAQ-plus-symbol.png'

export default function FAQs2() {
    const [showAnswer, setShowAnswer] = useState({});

    const toggleAnswer = (index) => {
        setShowAnswer((prevState)=>({
            ...prevState,
            [index]: !prevState[index]
        }))
    };

    return(
        <div className="overflow-hidden h-screen flex">
            <NavBar/>
          <div className="flex-1 overflow-y-scroll text-white" style={{ background: `url(${bgImage})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
            <h1 className="text-[40px] mt-[100px] ml-[53px]">FAQs</h1>
            {[...Array(5)].map((_, index) => (
                <div key={index} className={`grid ${showAnswer[index] ? "h-[325px]":"h-[100px]"} w-[933px] grid-rows-[85px_auto] border rounded-3xl mt-[23px] ml-[53px]`}>
                <div className="flex h-[px]">
                    <p className="text-[30px] mt-[23px] ml-[23px]">Question</p>
                    <button className="mt-[33px] mr-[23px] ml-auto text-[16px] text-blue-500 hover:underline" onClick={()=>toggleAnswer(index)} 
                    style={{ backgroundImage: `url(${icon})`,backgroundSize: "contain",backgroundRepeat: "no-repeat",
                    width: "30px", 
                    height: "30px"}}></button>
                </div>
                <div className="">
                    {showAnswer[index] && (
                        <div>
                            <hr className="border-t border-white-500" />
                            <p className="text-[20px] ml-[23px] mt-[15px]">"Answer......"</p>
                        </div>
                    )}
                </div>
                </div>  
            ))}
          </div>
        </div>
    )
}