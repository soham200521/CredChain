import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, LockClosedIcon, EyeIcon, UserGroupIcon } from "@heroicons/react/24/solid";

export default function WhyCredChain() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] font-sans">
      <main className="flex-1 flex flex-col items-center px-4 py-16">
        {/* Hero Section */}
        <section className="max-w-3xl w-full text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] text-transparent bg-clip-text mb-6 drop-shadow">
            Why CredChain?
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
            Reimagining credit for everyone—not just the privileged. CredChain empowers millions with a fair, secure, and transparent credit scoring system built for the future.
          </p>
          <div className="flex justify-center">
            <img
              src="/images/6566.jpg"
              alt="Inclusive finance illustration"
              className="w-64 md:w-80"
            />
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#4f8cfb]/20">
            <UserGroupIcon className="w-12 h-12 text-[#4f8cfb] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Fair & Inclusive</h3>
            <p className="text-[#b8cfff]">
              We use alternative data—like utility bills and gig income—to build credit for those left out by traditional systems.
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#a770ef]/20">
            <LockClosedIcon className="w-12 h-12 text-[#a770ef] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Privacy & Security</h3>
            <p className="text-[#b8cfff]">
              Your data is encrypted and stored on the blockchain. Only you control access—no more black-box credit bureaus.
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#eec0ff]/20">
            <EyeIcon className="w-12 h-12 text-[#eec0ff] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Transparency</h3>
            <p className="text-[#b8cfff]">
              See exactly how your score is calculated. No secrets, no surprises—just clarity and control.
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-[#4f8cfb]/20">
            <CheckCircleIcon className="w-12 h-12 text-[#4f8cfb] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Empowerment</h3>
            <p className="text-[#b8cfff]">
              Take charge of your financial future. CredChain opens doors to fair credit and new opportunities.
            </p>
          </div>
        </section>

        {/* Impact Section */}
        <section className="max-w-3xl w-full bg-white/15 backdrop-blur-lg rounded-2xl shadow-lg border border-[#4f8cfb]/20 p-8 mb-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Impact</h2>
          <p className="text-lg text-[#b8cfff] mb-4">
            <span className="font-extrabold text-[#4f8cfb]">190+ million</span> Indians lack a formal credit score. CredChain bridges this gap by making credit fair and accessible for all.
          </p>
        </section>

        {/* Testimonial */}
        <section className="max-w-2xl w-full bg-white/15 backdrop-blur-lg rounded-2xl shadow-lg border border-[#a770ef]/20 p-8 mb-16 text-center">
          <blockquote className="italic text-lg text-[#eec0ff] mb-2">
            “With CredChain, I finally got access to fair credit and new opportunities.”
          </blockquote>
          <span className="text-[#b8cfff] font-semibold">— Ayush, gig worker from Mumbai</span>
        </section>

        {/* CTA */}
        <div className="mb-8">
          <Link
            to="/how-it-works"
            className="px-8 py-4 bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] rounded-xl text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-[#a770ef]/50 transition"
          >
            See How It Works
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
