import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import FinancialDetails from "./pages/FinancialDetails";
import CreditScore from "./pages/CreditScore";
import './index.css';
import Navbar from "./pages/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import WhyCredChain from './pages/Why-CredChain';
import HowItWorks from './pages/HowItWorks';
//hi
// Import your new admin pages
import Admin from "./pages/Admin";
import VerifyDocs from "./pages/VerifyDocs";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/financial-details" element={<FinancialDetails />} />
        <Route path="/credit-score" element={<CreditScore />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/why-credchain" element={<WhyCredChain />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/verify-docs" element={<VerifyDocs />} />
      </Routes>
    </BrowserRouter>
  );
}
