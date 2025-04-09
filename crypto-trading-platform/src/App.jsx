import { Routes, Route } from "react-router-dom"; 
import LandingPage from "./LandingPage";
import Login from "./Login"
import SignUp from "./SignUp"
import Account from "./Account";
import Portfolio from "./Portfolio";
import Transaction from "./Transaction";
import Resources from "./Resources";
import FAQs from "./FAQs";
import Orders from "./Orders";
import Settings from "./Settings";
import FAQs2 from "./FAQsNonMember";
import Forum from "./Forum";
import ResourcesNonMember from "./ResourcesNonMember";
import PriceHistory from "./PriceHistory";
import Deposit from "./Deposit";
import Trading from "./Trading";
import TwoFactorSetup from "./TwoFactorSetup";
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-lightMode-background dark:bg-darkMode-background text-lightText-primary dark:text-darkText-primary transition-colors duration-200">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Portfolio" element={<Portfolio />} />
            <Route path="/Transaction" element={<Transaction />} />
            <Route path="/Resources" element={<Resources />} />
            <Route path="/FAQs" element={<FAQs />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path='/FAQsNonMember' element={<FAQs2 />} />
            <Route path='/Forum' element={<Forum />} />
            <Route path='/ResourcesNonMember' element={<ResourcesNonMember />} />
            <Route path='/PriceHistory' element={<PriceHistory />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
          </Routes>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;