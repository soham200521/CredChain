import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const CreditScoreDashboard = () => {
  const [score, setScore] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataAndPredict = async () => {
      setLoading(true);
      setError("");
      
      try {
        const detailsRes = await axios.get('/getdetails', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });

        if (!detailsRes.data) {
          throw new Error("Invalid data format from backend");
        }

        setUserData(detailsRes.data);

        // If predictionData is missing, user has no active approved score (pending first-time or rejected)
        if (!detailsRes.data.predictionData) {
          setLoading(false);
          return;
        }

        const predictionRes = await axios.post(
          'http://localhost:5001/predict', 
          detailsRes.data.predictionData,
          { 
            headers: { "Content-Type": "application/json" },
            timeout: 10000 
          }
        );

        if (!predictionRes.data?.prediction) {
          throw new Error("Invalid prediction response format");
        }

        setScore(predictionRes.data.prediction);
        
      } catch (err) {
        console.error("Error during fetch/prediction:", err);
        setError(err.response?.data?.error || err.message || "Prediction failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndPredict();
  }, []);

  // Score color and label logic
  const scoreInfo = useMemo(() => {
    if (score === null) return { color: '#6b7280', label: '—', gradient: 'from-gray-400 to-gray-600' };
    const s = Math.round(score);
    if (s >= 750) return { color: '#22c55e', label: 'Excellent', gradient: 'from-green-400 to-emerald-500' };
    if (s >= 650) return { color: '#3b82f6', label: 'Good', gradient: 'from-blue-400 to-blue-600' };
    if (s >= 500) return { color: '#f59e0b', label: 'Fair', gradient: 'from-yellow-400 to-amber-500' };
    return { color: '#ef4444', label: 'Needs Improvement', gradient: 'from-red-400 to-red-600' };
  }, [score]);

  // SVG gauge calculations
  const gaugePercent = score !== null ? Math.min(Math.max(score / 900, 0), 1) : 0;
  const radius = 90;
  const circumference = Math.PI * radius; // semicircle
  const strokeDashoffset = circumference - gaugePercent * circumference;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#4f8cfb]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#a770ef] animate-spin"></div>
          </div>
          <p className="text-white text-lg font-medium animate-pulse">Calculating your credit score...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_#ff408155] border border-red-500/30 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] rounded-xl text-white font-semibold hover:scale-105 transition shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Pending / Rejected Status Screen for Applicants without an active prediction score
  if (userData && !userData.predictionData) {
    const status = userData.latestStatus || userData.financialDetails?.verificationStatus;
    const isRejected = status === 'rejected';
    const remark = userData.adminRemark || userData.financialDetails?.adminRemark;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] text-white px-4 flex flex-col justify-center items-center font-sans">
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_0_50px_#4f8cfb40] border border-white/20 text-center space-y-6">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] flex items-center justify-center text-4xl shadow-xl border border-white/20">
            {isRejected ? '❌' : '⏳'}
          </div>

          <h2 className="text-3xl font-extrabold text-white">
            {isRejected ? 'Application Rejected' : 'Verification Under Review'}
          </h2>

          <p className="text-[#b8cfff] text-base leading-relaxed">
            {isRejected
              ? 'Your submitted financial details and proof documents were rejected by the admin.'
              : 'Your submitted financial details and proof documents are currently being reviewed by our admin team. Credit score details will be accessible once your application is accepted.'}
          </p>

          {isRejected && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-5 text-left space-y-2">
              <span className="text-red-400 font-bold text-xs uppercase tracking-wider block">Admin Remark / Feedback</span>
              <p className="text-red-200 text-sm font-medium">
                "{remark || 'No specific remark provided by admin.'}"
              </p>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/financial-details"
              className="px-6 py-3 bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] rounded-xl text-white font-bold shadow-lg hover:scale-105 transition"
            >
              {isRejected ? 'Re-submit Financial Details' : 'Update Details'}
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition"
            >
              Back to Home
            </a>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] text-white px-4 md:px-8 py-10 font-sans flex flex-col items-center">
      <div className="max-w-5xl w-full space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider animate-fade-in">
            Credit Score <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f8cfb] to-[#a770ef]">Overview</span>
          </h1>
          <p className="text-[#b8cfff] text-lg font-medium">Your AI-driven financial health & credit insights</p>
        </div>

        {/* Top Section: Score Gauge + User Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Score Gauge Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_#4f8cfb40] border border-[#4f8cfb]/30 flex flex-col items-center justify-center hover:shadow-[0_0_60px_#a770ef55] transition-all duration-500">
            <div className="relative w-64 h-36 mb-2">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Score arc */}
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke={scoreInfo.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: 'stroke-dashoffset 1.5s ease-out, stroke 1s ease',
                    filter: `drop-shadow(0 0 10px ${scoreInfo.color})`
                  }}
                />
                {/* Score number */}
                <text x="100" y="85" textAnchor="middle" fill="white" fontSize="38" fontWeight="bold" fontFamily="inherit">
                  {score !== null ? Math.round(score) : '—'}
                </text>
                {/* Min/Max labels */}
                <text x="15" y="108" textAnchor="middle" fill="#b8cfff" fontSize="11" fontWeight="500">0</text>
                <text x="185" y="108" textAnchor="middle" fill="#b8cfff" fontSize="11" fontWeight="500">900</text>
              </svg>
            </div>
            <span className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${scoreInfo.gradient} text-white shadow-lg tracking-wide`}>
              {scoreInfo.label}
            </span>
            <p className="text-[#b8cfff]/70 text-xs mt-3">Powered by ML & On-chain Verification</p>
          </div>

          {/* User Profile Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_#a770ef40] border border-[#a770ef]/30 flex flex-col justify-center space-y-5 hover:shadow-[0_0_60px_#4f8cfb55] transition-all duration-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] flex items-center justify-center text-xl font-extrabold text-white shadow-lg border border-white/20">
                {userData.userInfo.name.charAt(0)}
              </span>
              <span>{userData.userInfo.name}</span>
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#b8cfff]">
                <span className="text-pink-400">📧</span>
                <span className="font-medium">{userData.userInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#b8cfff]">
                <span className="text-purple-400">🏢</span>
                <span className="font-medium">Platform: <span className="text-white font-bold">{userData.userInfo.platform}</span></span>
              </div>
              <div className="flex items-center gap-3 text-[#b8cfff]">
                <span className="text-blue-400">📞</span>
                <span className="font-medium">{userData.userInfo.phone}</span>
              </div>
              {userData.financialDetails.verificationStatus !== undefined && (
                <div className="flex items-center gap-3 text-[#b8cfff]">
                  <span>{userData.financialDetails.verificationStatus === 'accepted' ? '✅' : '⏳'}</span>
                  <span className="font-medium">{userData.financialDetails.verificationStatus === 'accepted' ? 'Verified Member' : 'Pending Verification'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Monthly Income',
              value: `₹${userData.financialDetails.income.toLocaleString()}`,
              icon: '💰',
              borderColor: 'border-emerald-400/40',
              glow: '#22c55e'
            },
            {
              label: 'Total Dues',
              value: `₹${userData.dues.reduce((sum, due) => sum + due.amount, 0).toLocaleString()}`,
              icon: '📋',
              borderColor: 'border-rose-400/40',
              glow: '#ef4444'
            },
            {
              label: 'Work Hours/Week',
              value: `${userData.financialDetails.hours} hrs`,
              icon: '⏱️',
              borderColor: 'border-blue-400/40',
              glow: '#3b82f6'
            },
            {
              label: 'Platform Rating',
              value: userData.financialDetails.rating,
              icon: '⭐',
              borderColor: 'border-amber-400/40',
              glow: '#f59e0b'
            }
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white/10 backdrop-blur-xl rounded-2xl p-5 border ${card.borderColor} transition-all duration-300 hover:scale-[1.04] group shadow-lg`}
              style={{ boxShadow: `0 0 25px ${card.glow}25` }}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="text-[#b8cfff] text-xs uppercase font-semibold tracking-wider mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#4f8cfb] group-hover:to-[#a770ef] group-hover:bg-clip-text transition-all">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Dues Breakdown */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_#4f8cfb35] border border-[#4f8cfb]/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span>📊</span> Due Payments Breakdown
          </h2>
          <div className="space-y-3">
            {userData.dues.map((due, index) => {
              const isLate = due.status.includes('Late');
              return (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl px-5 py-4 border transition-all duration-300 hover:scale-[1.01] ${
                    isLate
                      ? 'bg-red-500/10 border-red-400/30'
                      : 'bg-white/5 border-white/15 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${isLate ? 'bg-red-400 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-400 shadow-[0_0_8px_#22c55e]'}`}></span>
                    <span className="text-white font-semibold text-lg">{due.title}</span>
                  </div>
                  <div className="flex items-center gap-4 pl-5 sm:pl-0">
                    <span className="text-white font-bold text-xl">₹{due.amount.toLocaleString()}</span>
                    <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                      isLate
                        ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {due.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreditScoreDashboard;
