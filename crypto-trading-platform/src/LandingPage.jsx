import bgImage from "./assets/Background-blur.png";
import Navbar from "./Navbar";

function LandingPage() {
    return (
        <div className="min-h-screen flex items-center justify-start bg-cover bg-no-repeat border border-black bg-gradient-to-t from-black/26 to-black/26" style={{ backgroundImage: `url(${bgImage})` }}>
            <Navbar />
            {/* Left side content with blur background */}
            <div className="relative w-1/2 min-h-screen p-8 bg-black/50 backdrop-blur-lg flex flex-col justify-center">
                

                {/* Headings */}
                <h1 className="text-4xl md:text-6xl font-bold text-white text-left mt-10">CRYPTO YOU CAN</h1>
                <h1 className="text-4xl md:text-6xl font-bold text-white text-left">COUNT ON</h1>

                {/* Subtitle */}
                <h3 className="text-lg text-white text-left mt-4 px-4 md:px-0">
                    Buy and sell a range of cryptocurrency assets on our secure and reliable platform from anytime, anywhere.
                </h3>

                {/* Buttons */}
                <div className="flex space-x-4 mt-8">
                    <button className="px-6 py-3 text-white border border-white rounded-full bg-[#091267] hover:bg-[#0a1b4c] transition duration-300">Login</button>
                    <button className="px-6 py-3 text-white rounded-full bg-gradient-to-r from-[#2011BA] to-[#57D2FF] hover:from-[#3b2ee0] hover:to-[#3fd2f1] transition duration-300">Signup</button>

                </div>
            </div>
        </div>
    );
}

export default LandingPage;
