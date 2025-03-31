import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Orders() {
  return(
    <div className="overflow-hidden h-screen flex">
      <NavBar2/>
      <div className="flex-1 overflow-y-scroll bg-no-repeat bg-cover ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
        {/*Market order to be connected*/}
        <h1 className="text-[40px] mt-[100px] ml-[53px]">Market Orders</h1>
        <div className="grid h-[250px] w-[933px] grid-rows-[85px_auto] border rounded-3xl mt-[23px] ml-[53px]">
          <div className="flex">
            <p className="text-[30px] mt-[23px] ml-[23px]">Order ID: 00000</p>
          </div>
          <div>
            <hr className="border-t border-white-500" />
            <p className="text-[20px] ml-[23px] mt-[15px]">"Order detail..."</p>
          </div>
        </div>

        {/*Limit order to be connected*/}
        <div className="flex mt-[32px] ml-[53px] items-center">
          <h1 className="text-[40px]">Limit Orders</h1>
          <button className="ml-[525px] px-5 text-[20px] border h-[35px] rounded-3xl hover:bg-blue-400 hover:text-black">Add Limit Order</button>
        </div>
        <div className="grid h-[140px] w-[933px] grid-rows-[50px_auto] border rounded-3xl mt-[23px] ml-[53px] content-center">
            <p className="text-[20px] ml-[23px]">Currency name: BTC</p>
            <div className="flex items-center">
              <p className="text-[20px] ml-[23px]">Specified price: £10,000,000,000</p>
              <button className="w-[87px] h-[41px] rounded-3xl ml-[500px] border hover:bg-blue-400 hover:text-black">
                <a href="#" className="">Edit</a></button>
            </div>
        </div>
            
        <div className="overflow-hidden h-screen">
          <div className="flex-1 overflow-y-scroll bg-no-repeat bg-cover text-white" style={{ background: `url(${bgImage})`}}>
                
          </div>
        </div>
      </div>
  </div>
  )
}