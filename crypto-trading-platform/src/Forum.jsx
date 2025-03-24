import React from "react";
import { useState } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import icon from "./assets/FAQ-plus-symbol.png";

export default function Forum() {
    const [subject, setSubject] = useState("");
    const [question, setQuestion] = useState("");
    const [forum, setForum] = useState([]);
    const [show, setShow] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        setForum([...forum, {subject: subject, question: question}])
    }
    
    const toggleShow = (index) => {
        setShow((prevState)=>({
            ...prevState,
            [index]: !prevState[index]
        }))
    };

    return(
        <div className="overflow-hidden h-screen flex">
            <NavBar2/>
            <div className="flex-1 overflow-y-scroll bg-no-repeat bg-cover ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
                <h1 className="text-[40px] mt-[100px] ml-[53px]">Forum</h1>
                <form className="grid rounded-3xl mt-[23px] ml-[53px] text-black">
                    <input type="text" placeholder="Type subject" onChange={(e)=>setSubject(e.target.value)} className="bg-white h-[63px] w-[933px] rounded-t-3xl placeholder-grey font-bold border-b border-grey"></input>
                    <textarea placeholder="Type question" onChange={(e)=>setQuestion(e.target.value)} className="bg-white h-[261px] w-[933px] rounded-b-3xl placeholder-grey font-bold border-t border-grey"></textarea>
                    <div className="flex">
                        <submit onClick={handleSubmit} className="mt-[20px] h-[41px] w-[116px] rounded-[30px] flex justify-center items-center border border-white text-white">Submit</submit>
                        <button onClick={()=>{setSubject(""); setQuestion("")}} className="ml-[13px] mt-[20px] h-[41px] w-[116px] rounded-[30px] flex justify-center items-center border border-white text-white">Clear</button>
                    </div>
                </form>
                <div className="overflow-hidden h-screen">
                    <div className="flex-1 overflow-y-scroll bg-no-repeat bg-cover text-white" style={{ background: `url(${bgImage})`}}>
                       {forum.map((entry,index)=>(
                            <div key={index} className={`grid ${show[index] ? "h-[325px]":"h-[100px]"} w-[933px] grid-rows-[85px_auto] border rounded-3xl mt-[23px] ml-[53px]`}>
                                <div className="flex h-[px]">
                                    <p className="text-[30px] mt-[23px] ml-[23px]">{entry.subject}</p>
                                    <button className="mt-[33px] mr-[23px] ml-auto text-[16px] text-blue-500 hover:underline" onClick={()=>toggleShow(index)} style={{ backgroundImage: `url(${icon})`,backgroundSize: "contain",backgroundRepeat: "no-repeat",width: "30px", height: "30px"}}></button>
                                </div>
                                <div className="">
                                    {show[index] && (
                                    <div>
                                        <hr className="border-t border-white-500" />
                                        <p className="text-[20px] ml-[23px] mt-[15px]">{entry.question}</p>
                                    </div>
                                )}
                                </div>
                            </div>
                       ))} 
                    </div>
                </div>
            </div>
        </div>
    )
}