import lgimg from "./assets/logoName.png";
import {Link} from "react-router-dom";

function Navbar() {
    return (
        <div className="fixed top-5 left-5 right-5 z-10 px-4 py-2 text-amber-50">
            <nav className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link to='/'>
                    <img src={lgimg} alt="Logo" className="h-8 mr-2"/>
                    </Link>
                </div>
                <div>
                    <ul className="flex items-center space-x-6">
                        <li>
                            <Link to="/ResourcesNonMember" className="text-lg hover:text-blue-500">Explore resources</Link>
                        </li>
                        <p>|</p>
                        <li>
                            <Link to="/FAQsNonMember" className="text-lg hover:text-blue-500">FAQs</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
