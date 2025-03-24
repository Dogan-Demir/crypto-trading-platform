import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Transaction() {
    return(
        <div className="">
          <NavBar2/>
          <div className="fixed h-[1024px] w-full bg-no-repeat ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
            <h1 className="text-[40px] mt-[100px] ml-[53px]">Transaction</h1>
            <div className="w-[933px] h-[325px] border rounded-3xl mt-[23px] ml-[53px] bg-white">
                <div className="flex mb-[23px] h-[59px] rounded-3xl font-bold">
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px] font-bold">ID</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px] font-bold">0jnsfniwf</p>
                    </div>
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px]">From</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px]">0jnsfniwf</p>
                    </div>
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px]">To</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px]">0jnsfniwf</p>
                    </div>
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px]">Amount</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px]">0jnsfniwf</p>
                    </div>
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px]">Type</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px]">0jnsfniwf</p>
                    </div>
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px]">Status</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px]">0jnsfniwf</p>
                    </div>
                    <div className="grid text-center w-[152px]">
                        <h2 className="mt-[16px] mb-[10px] text-black text-[23px]">Time</h2>
                        <p className="h-[92px] bg-black flex items-center justify-center m-[2px]">0jnsfniwf</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
    )
}