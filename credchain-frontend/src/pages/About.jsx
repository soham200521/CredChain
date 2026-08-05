import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

const team = [
  {
    name: "Sri Ram Varun Dittakavi",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/varun.jpg",
    linkedin: "https://www.linkedin.com/in/sri-ram-varun-dittakavi-4103a428a/",
    instagram: "https://instagram.com/varun_0636"
  },
  {
    name: "Shubham Daya Vadher",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/shubham.jpeg",
    linkedin: "https://www.linkedin.com/in/shubham-vadher-5839782a7/",
    instagram: "https://instagram.com/shubhamv_78"
  },
  {
    name: "Deep Sai Yadamreddi",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/deepsai.jpeg",
    linkedin: "https://www.linkedin.com/in/deep-sai-yadamreddi-6207bb1a9/",
    instagram: "https://instagram.com/_deepsai_06"
  },
  {
    name: "Soham Bacchuwar",
    role: "2nd Year B.Tech CSE Student",
    img: "/images/soham.jpg",
    linkedin: "https://www.linkedin.com/in/soham-bacchuwar-47a5b4296/",
    instagram: "https://instagram.com/sohambacchuwar"
  },
];

export default function About() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] flex flex-col items-center">
      <main className="flex flex-col items-center w-full flex-1 mt-24 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-center text-white drop-shadow-xl tracking-wider animate-fade-in">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f8cfb] to-[#a770ef]">CredChain</span>
        </h1>

        <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] px-8 py-6 max-w-3xl mx-auto mb-16 border border-[#4f8cfb]/30 hover:shadow-[0_0_60px_#a770ef70] transition-all duration-500">
          <p className="text-lg md:text-xl text-white text-center font-medium leading-relaxed">
            <span className="text-[#a770ef] font-bold">Our Mission:</span> 
            <br />
            CredChain exists to end financial exclusion for India's gig workers, low-income, and irregular earners. 
            We build fair credit scores using 5-6 key data points—like gig app earnings, utility bills, rent history, employment verification, and mobile recharge history—so banks can safely lend to people ignored by CIBIL.
            <br /><br />
            <span className="text-[#4f8cfb] font-bold">For Banks & Lenders:</span>
            <br />
            Our AI analyzes these key financial behaviors to predict repayment capability, turning high-risk "unbankables" into profitable customers. We help banks reduce risk while fulfilling their financial inclusion mandate.
            <br /><br />
            <span className="text-[#a770ef] font-bold">For Users:</span>
            <br />
            We help you escape loan sharks using your real financial behavior:
            <ul className="mt-2 list-disc list-inside text-[#b8cfff] text-base">
              <li>Utility bill payments</li>
              <li>Gig app earnings</li> 
              <li>Rent history</li>
              <li>Employment verification</li>
              <li>Mobile recharge history</li>
            </ul>
          </p>
        </div>

        <h2 className="text-4xl font-bold mb-10 text-[#4f8cfb] text-center drop-shadow animate-fade-in-up">
          Meet the Team
        </h2>

        <div className="flex flex-wrap justify-center gap-10 w-full">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="relative bg-white/15 backdrop-blur-md rounded-2xl border border-[#4f8cfb]/20 p-6 w-72 text-center shadow-[0_0_30px_#4f8cfb30] hover:shadow-[0_0_60px_#a770ef80] transition-all duration-500 transform hover:-translate-y-2 animate-float group"
            >
              <div className="w-24 h-24 rounded-full border-4 border-[#4f8cfb] bg-white flex items-center justify-center mx-auto -mt-14 mb-4 shadow-lg overflow-hidden relative">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4f8cfb40] to-[#a770ef40] blur-sm opacity-50"></div>
              </div>
              <h3 className="text-xl font-semibold text-white drop-shadow-sm">{member.name}</h3>
              <p className="text-[#b8cfff] mt-1 font-medium text-sm">{member.role}</p>
              <div className="flex justify-center gap-6 mt-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0a66c2] hover:text-[#4f8cfb] transition-colors text-2xl transform hover:scale-125"
                  title="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e1306c] hover:text-[#a770ef] transition-colors text-2xl transform hover:scale-125"
                    title="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full bg-[#14182b] text-gray-300 py-8 px-4 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-col md:flex-row md:gap-8 items-center gap-2">
            <a href="/about" className="hover:text-[#a770ef] transition">About</a>
            <a href="/faq" className="hover:text-[#a770ef] transition">FAQ</a>
            <a href="/privacy" className="hover:text-[#a770ef] transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#a770ef] transition">Terms</a>
          </div>
          {/* Contact Info */}
          <div className="text-center">
            <div>
              <span className="font-semibold">Email:</span>{" "}
              <a href="mailto:support@credchain.com" className="text-[#a770ef] hover:underline">
                support@credchain.com
              </a>
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              <span className="text-[#4f8cfb]">+91-90000-00009</span>
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
