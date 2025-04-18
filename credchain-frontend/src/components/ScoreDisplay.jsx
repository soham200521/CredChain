import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import credChainAbi from "../abi/CredChain.json";

const CONTRACT_ADDRESS = "0xB97cA9cbAae9A11f82205de0497b248D8ab4b11D";

export default function ScoreDisplay() {
  const { account, library, active, chainId } = useWeb3React();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const TARGET_CHAIN_ID = 11155111;

  useEffect(() => {
    const fetchScore = async () => {
      if (!active || !account || !library || chainId !== TARGET_CHAIN_ID) return;
      
      setLoading(true);
      setError("");
      
      try {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS, 
          credChainAbi.abi || credChainAbi, 
          library
        );
        const userScore = await contract.getScore(account);
        
        // Trigger confetti when score is found
        if (userScore.toNumber() > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        
        setScore(userScore.toNumber());
      } catch (err) {
        setError("Could not fetch score.");
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [account, library, active, chainId]);

  if (!active) return null;

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md text-center 
                   transition-all duration-300 hover:scale-105">
      {/* Confetti Component */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
        🎉 Your Credit Score
      </h2>

      {loading && (
        <div className="space-y-2">
          <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && score !== null && (
        <div className="space-y-4">
          <div className="text-6xl font-bold text-green-600 animate-bounce">
            {score}
          </div>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full
                       transform transition hover:scale-105"
            onClick={() => setShowConfetti(true)}
          >
            Celebrate! 🎊
          </button>
        </div>
      )}
    </div>
  );
}
