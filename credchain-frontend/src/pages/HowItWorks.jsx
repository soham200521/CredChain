import React from "react";
import { Link } from "react-router-dom";
import { UserPlusIcon, DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] font-sans">
      <main className="flex-1 flex flex-col items-center px-4 py-16">
        {/* Hero Section */}
        <section className="max-w-3xl w-full text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] text-transparent bg-clip-text mb-6 drop-shadow">
            How CredChain Works
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
            From credit invisible to loan eligible—in three transparent steps.
          </p>
        </section>

        {/* Steps */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Step 1 */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#4f8cfb]/20">
            <UserPlusIcon className="w-14 h-14 text-[#4f8cfb] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sign Up & Connect</h3>
            <p className="text-[#b8cfff]">
              Create your account and connect your digital wallet or preferred gig app.
            </p>
          </div>
          {/* Step 2 */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#a770ef]/20">
            <DocumentTextIcon className="w-14 h-14 text-[#a770ef] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Share Your Financial Story</h3>
            <p className="text-[#b8cfff]">
              Add your gig earnings, utility bills, rent, and employment history. We analyze:
              <ul className="mt-2 text-left list-disc pl-4">
                <li>Gig app earnings (Swiggy/Zomato/Uber etc.)</li>
                <li>Utility bill payments</li>
                <li>Rent payment history</li>
                <li>Employment verification</li>
                <li>Mobile recharge history</li>
              </ul>
            </p>
          </div>
          {/* Step 3 */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#eec0ff]/20">
            <ShieldCheckIcon className="w-14 h-14 text-[#eec0ff] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Get Loan Offers & Build CIBIL</h3>
            <p className="text-[#b8cfff]">
              Partner banks use our score to offer you collateral-free loans. Repay on time, and your CIBIL score grows—unlocking better financial opportunities.
              <span className="block mt-2 font-semibold text-[#4f8cfb]">
                Typical offers: ₹10,000–₹5,00,000 at competitive rates.
              </span>
            </p>
          </div>
        </section>

        {/* Security Note */}
        <section className="max-w-2xl w-full bg-white/15 backdrop-blur-lg rounded-2xl shadow-lg border border-[#4f8cfb]/20 p-8 mb-16 text-center">
          <p className="text-lg text-[#b8cfff] font-semibold">
            <span className="text-[#4f8cfb]">Your data is encrypted</span> and only you control access. We never share without your consent.
          </p>
        </section>

        {/* CTA */}
        <div className="mb-8">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] rounded-xl text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-[#a770ef]/50 transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#14182b] text-gray-300 py-8 px-0">
        <div className="flex flex-col md:flex-row justify-center items-center gap-y-6 md:gap-x-16 w-full">
          {/* Links */}
          <div className="flex flex-col md:flex-row items-center gap-x-8 gap-y-2">
            <a href="/about" className="hover:text-[#a770ef] transition font-semibold">About</a>
            <a href="/faq" className="hover:text-[#a770ef] transition font-semibold">FAQ</a>
            <a href="/privacy" className="hover:text-[#a770ef] transition font-semibold">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#a770ef] transition font-semibold">Terms</a>
          </div>
          {/* Contact Info */}
          <div className="text-center md:text-left font-semibold">
            <div>
              <span>Email: </span>
              <a href="mailto:support@credchain.com" className="text-[#a770ef] hover:underline">
                support@credchain.com
              </a>
            </div>
            <div>
              <span>Phone: </span>
              <span className="text-[#4f8cfb]">+91-90000-00009</span>
            </div>
          </div>
          {/* Copyright */}
          <div className="text-center text-sm text-gray-400 md:text-left">
            © {new Date().getFullYear()} CredChain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
