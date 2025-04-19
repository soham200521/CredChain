import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreditScoreDashboard = () => {
  const [score, setScore] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataAndPredict = async () => {
      console.log("Starting data fetch and prediction...");
      setLoading(true);
      setError("");
      
      try {
        // 1. Get user details from backend
        console.log("Fetching user details from /getdetails...");
        const detailsRes = await axios.get('/getdetails', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        
        console.log("Raw response from /getdetails:", detailsRes.data);

        if (!detailsRes.data?.financialDetails || !detailsRes.data.dues) {
          throw new Error("Invalid data format from backend");
        }

        // 2. Process financial data
        const totalDues = detailsRes.data.dues.reduce((sum, due) => {
          console.log(`Processing due: ${due.title} - ${due.amount}`);
          return sum + due.amount;
        }, 0);
        
        const income = detailsRes.data.financialDetails.income;
        const costToIncome = income > 0 
          ? (totalDues / income).toFixed(2)
          : 0;

        console.log("Calculated values:", {
          totalDues,
          income,
          costToIncome
        });

        // 3. Prepare prediction payload
        const predictionData = {
          platform: detailsRes.data.userInfo.platform,
          income: income,
          dues: totalDues,
          cost_to_income: costToIncome,
          platform_rating: detailsRes.data.financialDetails.rating,
          SIZE: detailsRes.data.financialDetails.duration,
          work_hours_per_week: detailsRes.data.financialDetails.hours
        };

        console.log("Payload for prediction:", predictionData);

        // 4. Get prediction from Flask API
        console.log("Sending prediction request to Flask...");
        const predictionRes = await axios.post(
          'http://localhost:5001/predict', 
          predictionData,
          { 
            headers: { "Content-Type": "application/json" },
            timeout: 10000 
          }
        );

        console.log("Prediction response:", predictionRes.data);

        if (!predictionRes.data?.prediction) {
          throw new Error("Invalid prediction response format");
        }

        // 5. Update state
        setUserData(detailsRes.data);
        setScore(predictionRes.data.prediction);
        
      } catch (err) {
        console.error("Error during fetch/prediction:", {
          message: err.message,
          response: err.response?.data,
          stack: err.stack
        });
        setError(err.response?.data?.error || err.message || "Prediction failed");
      } finally {
        setLoading(false);
        console.log("Process completed");
      }
    };

    fetchDataAndPredict();
  }, []);


  if (loading) return <div className="loading">Loading credit score...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Credit Score Overview</h1>
      
      <div className="user-profile">
        <h2>{userData.userInfo.name}</h2>
        <p>Platform: {userData.userInfo.platform}</p>
        <p>Email: {userData.userInfo.email}</p>
      </div>

      <div className="score-display">
        <div className="score-number">
          {score.toFixed(0)}
        </div>
        <div className="score-label">Current Credit Score</div>
      </div>

      <div className="financial-summary">
        <div className="summary-card">
          <h3>Income</h3>
          <p>₹{userData.financialDetails.income.toLocaleString()}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Dues</h3>
          <p>₹{userData.dues.reduce((sum, due) => sum + due.amount, 0).toLocaleString()}</p>
        </div>
        
        <div className="summary-card">
          <h3>Work Hours/Week</h3>
          <p>{userData.financialDetails.hours} hrs</p>
        </div>
      </div>

      <div className="dues-breakdown">
        <h2>Due Payments</h2>
        <ul>
          {userData.dues.map((due, index) => (
            <li key={index} className={`due-item ${due.status.includes('Late') ? 'late' : ''}`}>
              <span className="due-title">{due.title}</span>
              <span className="due-amount">₹{due.amount.toLocaleString()}</span>
              <span className="due-status">{due.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreditScoreDashboard;
