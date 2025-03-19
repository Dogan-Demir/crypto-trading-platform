import React from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function Account() {
    return(
        <div className="">
          <NavBar2/>
          <div className="fixed h-[1024px] w-full bg-no-repeat ml-[398px] text-white" style={{ background: `url(${bgImage})` }}>
            <h1 className="text-[40px] mt-[100px] ml-[53px]">Account</h1>
            <div className="w-[933px] h-[325px] border rounded-3xl mt-[23px] ml-[53px]"></div>
          </div>
        </div>
    )
}