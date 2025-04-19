import { useAuth0 } from "@auth0/auth0-react";

export default function Overview() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-black text-white px-8 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-5xl mx-auto space-y-16 flex flex-col justify-center py-16 mt-3">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-fade-in-up">
            Welcome to <span className="underline decoration-pink-500/50">CredChain!</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in">
            We’re transforming the credit scoring experience with blockchain — private, secure, and built for the future.
          </p>
          {/* SINGLE CTA BUTTON */}
          <div className="flex justify-center mt-6 animate-fade-in-up">
            <button
              onClick={() => loginWithRedirect()}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-pink-400/50 transition"
            >
              Get Your Credit Score
            </button>
          </div>
        </div>

        {/* Gradient Glass Card */}
        <div className="bg-gradient-to-br from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] rounded-3xl p-7 md:p-9 shadow-[0_0_40px_#ff80bf55] border border-white/10 backdrop-blur-xl space-y-10 animate-fade-in-up">
          {/* What is CredChain? */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white tracking-tight">
              🏦 What is CredChain?
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              CredChain is a blockchain-powered platform that helps people without traditional credit histories get fair credit scores by using alternative data like utility payments and gig work income. It empowers users to access financial opportunities with transparency and security.
            </p>
          </div>

          {/* Why Financial Inclusion Matters */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white tracking-tight">
              🌍 Why Financial Inclusion Matters
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              In India especially, many people lack formal credit histories and struggle to increase their scores because low-income individuals have tax exemptions, while paying tax helps increase credit scores. We aim to bridge this gap and provide a more inclusive financial ecosystem, so everyone can access fair credit and financial opportunities.
            </p>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full bg-[#181824] text-gray-300 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-col md:flex-row md:gap-8 items-center gap-2">
            <a href="/about" className="hover:text-pink-400 transition">About</a>
            <a href="/faq" className="hover:text-pink-400 transition">FAQ</a>
            <a href="/privacy" className="hover:text-pink-400 transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-pink-400 transition">Terms</a>
          </div>
          {/* Contact Info */}
          <div className="text-center">
            <div>
              <span className="font-semibold">Email:</span>{" "}
              <a href="mailto:support@credchain.com" className="text-pink-400 hover:underline">
                support@credchain.com
              </a>
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              <span className="text-blue-300">+91-90000-00009</span>
            </div>
          </div>
          {/* Copyright */}
          <div className="text-center text-sm text-gray-400 mt-4 md:mt-0">
            © {new Date().getFullYear()} CredChain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
