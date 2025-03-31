import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Transaction() {
    return(
    <div className="">
        <NavBar2/>
        <div className="fixed h-[1024px] w-full bg-no-repeat ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
          <h1 className="text-[40px] mt-[100px] ml-[53px]">Transaction</h1>
          <div className="w-[1253px] h-[325px] border rounded-3xl mt-[23px] ml-[53px] bg-white">
            <div className="flex text-center text-[27px] font-bold text-black mt-[23px]">
                <p className="basis-[200px]">ID</p>
                <p className="basis-[200px]">From</p>
                <p className="basis-[200px]">To</p>
                <p className="basis-[200px]">Amount</p>
                <p className="basis-[110px]">Type</p>
                <p className="basis-[150px]">Status</p>
                <p className="basis-[200px]">Time</p>
            </div>

            {/*implement data when available*/}
            <div className="flex text-center text-[23px] mt-[23px] h-[80px]">
                <p className="bg-black border basis-[200px]">0000000000</p>
                <p className="bg-black border basis-[200px]">0000000000</p>
                <p className="bg-black border basis-[200px]">0000000000</p>
                <p className="bg-black border basis-[200px]">£4000.00</p>
                <p className="bg-black border basis-[110px]">BTC</p>
                <p className="bg-black border basis-[150px]">Confirmed</p>
                <p className="bg-black border basis-[200px]">2025-03-31 12:45:33</p>
            </div>
          </div>
        </div>
    </div>
    )
}