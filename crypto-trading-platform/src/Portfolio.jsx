import React from "react";
import {Link} from "react-router-dom";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Portfolio() {
    return(
        <div className="overflow-hidden h-screen flex">
          <NavBar2/>
          <div className="flex-1 overflow-y-scroll bg-no-repeat bg-cover ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
            <div className="flex mt-[100px] ml-[53px]">
              <h1 className="text-[40px]">Portfolio</h1>
              <button className="w-[117px] h-[41px] rounded-3xl ml-[524px] border hover:bg-blue-400 hover:text-black">
                <a href="#" className="">Deposit</a></button>
              <button className="w-[117px] h-[41px] rounded-3xl ml-[16px] border hover:bg-blue-400 hover:text-black">
                <a href="#" className="">Withdraw</a></button>
            </div>
            <div className="grid">
              <div className="w-[933px] h-[225px] border rounded-3xl mt-[23px] ml-[53px]">
                <p className="text-[30px] mt-[23px] ml-[23px]">Value:</p>
                <hr className="border-white-500 mt-[13px]"/>
                <p className="text-[40px] font-semibold ml-[23px]">£0.00</p>
              </div>

              {/*implement data when available*/}
              <div className="grid">
                <div className="mt-[40px] ml-[53px] border rounded-3xl w-[933px] h-[525px]">
                  <p className="text-[30px] mt-[23px] ml-[23px]">Asset Analysis</p>
                  <hr className="border-white-500 mt-[13px]"/>
                  <p className="">Asset graph to be added...</p>
                  <p className="mt-[200px]">Pie chart to be implemented....</p>
                </div>
              </div>
              <div className="">
                <div className="mt-[40px] ml-[53px] border rounded-3xl w-[933px] h-[225px]">
                  <p className="text-[30px] mt-[23px] ml-[23px]">Crypto</p>
                  <hr className="border-white-500 mt-[13px]"/>
                  <div className="flex text-[23px] font-bold ml-[23px] mt-[23px]">
                    <p className="">Name</p>
                    <p className="ml-[130px]">Price</p>
                    <p className="ml-[100px]">Quantity Held</p>
                    <p className="ml-[100px]">Total Value</p>
                    <p className="ml-[100px]">24h</p>
                  </div>

                  {/*implement for each crypto*/}
                  <div className="flex flex-column- mt-[15px] ml-[23px] text-[18px]">
                    <p className="groww-0 shrink-0 basis-[180px]">Stablecoin (USDT)</p>
                    <p className="ml-[11px] basis-[145px] grow-0 shrink-0">£6000.00</p>
                    <p className="ml-[11px] basis-[239px] grow-0 shrink-0">5.0</p>
                    <p className="ml-[11px] basis-[205px] grow-0 shrink-0">£30000.00</p>
                    {/*implement colour changes*/}
                    <p className="ml-[11px] basis-[85px] grow-0 shrink-0">+1.6%</p>
                  </div>
                </div>
              </div>
              <Link to="/PriceHistory"><button className="ml-[53px] mt-[39px] mb-[40px] rounded-3xl w-[170px] h-[33px] border hover:bg-blue-400 hover:text-black">View Price History</button></Link>
            </div>

          </div>
        </div>
    )
}