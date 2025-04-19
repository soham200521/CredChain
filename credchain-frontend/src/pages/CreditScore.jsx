import React, { useEffect, useState } from 'react';
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
            Authorization: `Bearer ${localStorage.getItem('token')}` // <-- Fixed template string
          }
        });

        if (!detailsRes.data?.financialDetails || !detailsRes.data.dues) {
          throw new Error("Invalid data format from backend");
        }

        const totalDues = detailsRes.data.dues.reduce((sum, due) => sum + due.amount, 0);
        const income = detailsRes.data.financialDetails.income;
        const costToIncome = income > 0 ? (totalDues / income).toFixed(2) : 0;

        const predictionData = {
          platform: detailsRes.data.userInfo.platform,
          income: income,
          dues: totalDues,
          cost_to_income: costToIncome,
          platform_rating: detailsRes.data.financialDetails.rating,
          SIZE: detailsRes.data.financialDetails.duration,
          work_hours_per_week: detailsRes.data.financialDetails.hours
        };

        const predictionRes = await axios.post(
          'http://localhost:5001/predict', 
          predictionData,
          { 
            headers: { "Content-Type": "application/json" },
            timeout: 10000 
          }
        );

        if (!predictionRes.data?.prediction) {
          throw new Error("Invalid prediction response format");
        }

        setUserData(detailsRes.data);
        setScore(predictionRes.data.prediction);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Prediction failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndPredict();
  }, []);

  // --- Styled Layout Below ---

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e]">
      <div className="text-white text-2xl font-bold animate-pulse">Loading credit score...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e]">
      <div className="bg-white/10 p-8 rounded-2xl text-red-400 text-xl font-semibold shadow-lg">
        Error: {error}
      </div>
    </div>
  );

  if (!userData) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] flex flex-col items-center">
      <main className="flex flex-col items-center w-full flex-1 mt-24 px-4">

        {/* Header */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-center text-white drop-shadow-xl tracking-wider animate-fade-in">
          Credit <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f8cfb] to-[#a770ef]">Score</span>
        </h1>

        {/* User Profile Card */}
        <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] px-8 py-6 max-w-2xl mx-auto mb-10 border border-[#4f8cfb]/30 hover:shadow-[0_0_60px_#a770ef70] transition-all duration-500">
          <h2 className="text-2xl font-bold text-white mb-2">{userData.userInfo.name}</h2>
          <p className="text-[#b8cfff] mb-1">Platform: {userData.userInfo.platform}</p>
          <p className="text-[#b8cfff]">Email: {userData.userInfo.email}</p>
        </div>

        {/* Credit Score Display */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-tr from-[#4f8cfb] to-[#a770ef] text-white text-6xl font-extrabold rounded-full w-40 h-40 flex items-center justify-center shadow-[0_0_60px_#a770ef70] mb-4 border-8 border-white/20">
            {score !== null ? Number(score).toFixed(0) : '--'}
          </div>
          <div className="text-xl text-white font-semibold">Current Credit Score</div>
        </div>

        {/* Financial Summary Cards */}
        <div className="flex flex-wrap justify-center gap-8 w-full mb-12">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl border border-[#4f8cfb]/20 p-6 w-64 text-center shadow-[0_0_30px_#4f8cfb30]">
            <h3 className="text-lg font-bold text-[#4f8cfb] mb-2">Income</h3>
            <p className="text-white text-xl font-semibold">₹{userData.financialDetails.income.toLocaleString()}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl border border-[#4f8cfb]/20 p-6 w-64 text-center shadow-[0_0_30px_#4f8cfb30]">
            <h3 className="text-lg font-bold text-[#a770ef] mb-2">Total Dues</h3>
            <p className="text-white text-xl font-semibold">
              ₹{userData.dues.reduce((sum, due) => sum + due.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl border border-[#4f8cfb]/20 p-6 w-64 text-center shadow-[0_0_30px_#4f8cfb30]">
            <h3 className="text-lg font-bold text-[#4f8cfb] mb-2">Work Hours/Week</h3>
            <p className="text-white text-xl font-semibold">{userData.financialDetails.hours} hrs</p>
          </div>
        </div>

        {/* Dues Breakdown */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-3xl w-full shadow-[0_0_40px_#a770ef40] border border-[#a770ef]/20">
          <h2 className="text-2xl font-bold text-[#a770ef] mb-6">Due Payments</h2>
          <ul className="space-y-4">
            {userData.dues.map((due, index) => (
              <li
                key={index}
                className={`flex justify-between items-center px-4 py-3 rounded-xl ${due.status.includes('Late') ? 'bg-red-400/10 border border-red-400/30' : 'bg-white/5 border border-white/10'} transition-all`}
              >
                <span className="font-medium text-white">{due.title}</span>
                <span className="font-bold text-[#4f8cfb]">₹{due.amount.toLocaleString()}</span>
                <span className={`text-sm font-semibold ${due.status.includes('Late') ? 'text-red-400' : 'text-green-400'}`}>{due.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      {/* Optional: Add About page styled footer here */}
    </div>
  );
};

export default CreditScoreDashboard;
