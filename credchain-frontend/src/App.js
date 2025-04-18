import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import FinancialDetails from "./pages/FinancialDetails";
import CreditScore from "./pages/CreditScore";
import './index.css';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/financial-details" element={<FinancialDetails />} />
        <Route path="/credit-score" element={<CreditScore />} />
        {/* Optional: 404 page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
