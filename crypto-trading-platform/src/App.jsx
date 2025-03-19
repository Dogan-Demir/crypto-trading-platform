import { Routes, Route } from "react-router-dom"; 
import LandingPage from "./LandingPage";
import Login from "./Login"
import SignUp from "./SignUp"
import Account from "./Account";
import Portfolio from "./Portfolio";
import Resources from "./Resources";
import FAQs from "./FAQs";
import Orders from "./Orders";
import Settings from "./Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/Portfolio" element={<Portfolio />} />
      <Route path="/Resources" element={<Resources />} />
      <Route path="/FAQs" element={<FAQs />} />
      <Route path="/Orders" element={<Orders />} />
      <Route path="/Settings" element={<Settings />} />
    </Routes>
  );
}

export default App;