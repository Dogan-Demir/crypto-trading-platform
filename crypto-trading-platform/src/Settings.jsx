import React from "react";
import { useState } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Settings() {
    const [select2FAs, setSelected2FA] = useState('Email');
    const [selectPA, setSelectedPA] = useState('Email');
    return (
        <div className="flex min-h-screen bg-[#0F1429]">
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className="min-h-screen text-white bg-no-repeat bg-cover relative"
                     style={{ 
                         background: `url(${bgImage})`,
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Settings</h1>
                        <div className="w-[933px] h-[282px] border rounded-3xl mt-[23px] ml-[53px]">
                            <p className="text-[30px] mt-[23px] ml-[23px]">Personal Details</p>
                            <hr className="border-white-500 mt-[13px]" />
                            <div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[119px]">Public ID</p>
                                <p className="">ABC123</p>
                              </div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[149px]">Email</p>
                                <p className="">ABC123@outlook.com</p>
                                <button className="w-[87px] h-[41px] rounded-3xl ml-[400px] border hover:bg-blue-400 hover:text-black">
                                  <a href="#" className="">Edit</a></button>
                              </div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[140px]">Phone</p>
                                <p className="">+44 7771 123123</p>
                                <button className="w-[87px] h-[41px] rounded-3xl ml-[446px] border hover:bg-blue-400 hover:text-black">
                                  <a href="#" className="">Edit</a></button>
                              </div>
                            </div>
                        </div>

                        <div className="w-[933px] h-[282px] border rounded-3xl mt-[23px] ml-[53px]">
                            <p className="text-[30px] mt-[23px] ml-[23px]">Preferences</p>
                            <hr className="border-white-500 mt-[13px]" />
                            <div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[179px]">2FA</p>
                                <button className={`w-[87px] h-[41px] border rounded-3xl mr-[30px] ${select2FAs==='Email'? "bg-blue-400 text-black":""}`} onClick={()=>setSelected2FA('Email')}>Email</button>
                                <button className={`w-[87px] h-[41px] border rounded-3xl mr-[30px] ${select2FAs==='Push'? "bg-blue-400 text-black":""}`} onClick={()=>setSelected2FA('Push')}>Push</button>
                                <button className={`w-[87px] h-[41px] border rounded-3xl mr-[30px] ${select2FAs==='SMS'? "bg-blue-400 text-black":""}`} onClick={()=>setSelected2FA('SMS')}>SMS</button>
                              </div>
                            </div>
                            <div>
                              <div className="flex text-[20px] ml-[23px] mt-[23px]">
                                <p className="mr-[125px]">Price Alert</p>
                                <button className={`w-[87px] h-[41px] border rounded-3xl mr-[30px] ${selectPA==='Email'? "bg-blue-400 text-black":""}`} onClick={()=>setSelectedPA('Email')}>Email</button>
                                <button className={`w-[87px] h-[41px] border rounded-3xl mr-[30px] ${selectPA==='Push'? "bg-blue-400 text-black":""}`} onClick={()=>setSelectedPA('Push')}>Push</button>
                                <button className={`w-[87px] h-[41px] border rounded-3xl mr-[30px] ${selectPA==='SMS'? "bg-blue-400 text-black":""}`} onClick={()=>setSelectedPA('SMS')}>SMS</button>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}