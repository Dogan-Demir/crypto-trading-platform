import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function PriceHistory() {
    return(
        <div className="overflow-hidden h-screen flex">
          <NavBar2/>
          <div className="flex-1 overflow-y-scroll bg-no-repeat bg-cover ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
            <h1 className="text-[40px] mt-[100px] ml-[53px]">Price History</h1>

            {/*implement graphs here when available*/}
            <div className="w-[933px] h-[325px] border rounded-3xl mt-[23px] ml-[53px]">
              <p className="text-[30px] mt-[23px] ml-[23px]">Stablecoin</p>
              <p className="text-[20px] ml-[23px]">Graph showing price history here....</p>
            </div>
          </div>
        </div>
    )
}