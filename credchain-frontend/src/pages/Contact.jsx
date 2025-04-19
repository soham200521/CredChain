import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Integrate with backend or email service here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] flex flex-col items-center">
      <main className="flex flex-col items-center w-full flex-1 mt-24 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-center text-white drop-shadow-xl tracking-wider animate-fade-in">
          Contact <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f8cfb] to-[#a770ef]">CredChain</span>
        </h1>
        <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] px-8 py-6 max-w-3xl mx-auto mb-10 border border-[#4f8cfb]/30 hover:shadow-[0_0_60px_#a770ef70] transition-all duration-500">
          <p className="text-lg md:text-xl text-white text-center font-medium leading-relaxed mb-4">
            Have a question, suggestion, or need support? We’re here to help! Fill out the form below and our team will get back to you within 24 hours.
          </p>
          <p className="text-base text-[#b8cfff] text-center mb-2">
            At CredChain, we value your feedback and are committed to providing transparent, responsive support for all users and partners.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl justify-center">
          {/* Contact Form */}
          <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl border border-[#4f8cfb]/20 p-8 shadow-[0_0_30px_#4f8cfb30] hover:shadow-[0_0_60px_#a770ef80] transition-all duration-500">
            {submitted ? (
              <div className="text-green-300 font-semibold text-center text-lg py-16">
                Thank you for reaching out!<br />We have received your message and will get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full rounded-lg px-4 py-3 bg-white/30 border border-[#4f8cfb] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] placeholder-[#b8cfff] font-medium"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full rounded-lg px-4 py-3 bg-white/30 border border-[#4f8cfb] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] placeholder-[#b8cfff] font-medium"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-lg px-4 py-3 bg-white/30 border border-[#4f8cfb] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4f8cfb] placeholder-[#b8cfff] font-medium resize-y"
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] text-white font-bold py-3 rounded-lg shadow-lg hover:from-[#a770ef] hover:to-[#4f8cfb] transition-all duration-300 text-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
          {/* Contact Info */}
          <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl border border-[#4f8cfb]/20 p-8 shadow-[0_0_30px_#4f8cfb30] flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#4f8cfb] mb-4 text-center">Contact Information</h2>
            <div className="text-white text-base space-y-3 mb-6">
              <div>
                <span className="font-semibold">Email:</span>{' '}
                <a href="mailto:support@credchain.com" className="text-[#a770ef] hover:underline">
                  support@credchain.com
                </a>
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{' '}
                <span className="text-[#4f8cfb]">+91-90000-00009</span>
              </div>
              <div>
                <span className="font-semibold">Address:</span>
                <div className="text-[#b8cfff]">
                  Malviya Hostel,<br />
                  MNNIT Allahabad,<br />
                  Prayagraj - 211004,<br />
                  Uttar Pradesh, India
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-[#b8cfff] text-center text-sm">
              <strong>Support Hours:</strong><br />
              Monday - Friday: 9:00 AM - 6:00 PM IST
            </div>
          </div>
        </div>
        {/* Commitment Section */}
        <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] px-8 py-6 max-w-3xl mx-auto mt-12 border border-[#4f8cfb]/30">
          <h2 className="text-xl font-bold text-[#4f8cfb] mb-2 text-center">Our Commitment to You</h2>
          <p className="text-base text-white text-center font-medium leading-relaxed">
            At CredChain, your satisfaction and trust are our top priorities. We are committed to providing prompt, transparent, and effective support to all our users and partners. Our team is constantly working to improve our services and address your needs. Don’t hesitate to reach out — your voice helps us shape the future of decentralized credit scoring!
          </p>
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
