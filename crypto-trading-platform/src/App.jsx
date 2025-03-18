import { Routes, Route } from "react-router-dom"; 
import LandingPage from "./LandingPage";
import Login from "./Login"
import SignUp from "./SignUp"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
