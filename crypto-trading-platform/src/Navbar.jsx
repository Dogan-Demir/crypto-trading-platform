import lgimg from "./assets/logo.png";

function Navbar() {
    return (
        <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2 text-amber-50">
            <nav className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src={lgimg} alt="Logo" className="h-8 mr-2" />
                    <h2 className="text-xl font-bold">CRYPTX</h2>
                </div>
                <div>
                    <ul className="flex items-center space-x-6">
                        <li>
                            <a href="#" className="text-lg hover:text-blue-500">Explore resources</a>
                        </li>
                        <p>|</p>
                        <li>
                            <a href="#" className="text-lg hover:text-blue-500">FAQs</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
