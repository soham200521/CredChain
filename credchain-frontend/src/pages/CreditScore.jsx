import React from "react";

const MOCK_SCORE = 300; // Replace with real score from backend
const MAX_SCORE = 900;
const TARGET_SCORE = 650;

function getProgress(score) {
  return Math.min(Math.round((score / MAX_SCORE) * 100), 100);
}
function getToTargetPercent(score) {
  if (score >= TARGET_SCORE) return 0;
  return Math.ceil(((TARGET_SCORE - score) / MAX_SCORE) * 100);
}

export default function CreditScore() {
  const score = MOCK_SCORE; // Replace with real user score
  const progress = getProgress(score);
  const toTargetPercent = getToTargetPercent(score);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c31] via-[#22304f] to-[#3a245e] font-sans px-4">
      <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_#4f8cfb40] p-10 w-full max-w-xl border border-[#4f8cfb]/30">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4f8cfb] to-[#a770ef] drop-shadow">
          Your Credit Score
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="text-5xl font-bold text-white mb-2">{score} / {MAX_SCORE}</div>
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-8 overflow-hidden border border-[#4f8cfb]/30 shadow-inner mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500`}
              style={{
                width: `${progress}%`,
                background: score >= TARGET_SCORE
                  ? "linear-gradient(to right, #4f8cfb, #a770ef)"
                  : "linear-gradient(to right, #f87171, #fbbf24)"
              }}
            />
          </div>
          <div className="w-full flex justify-between text-xs text-[#b8cfff] mb-4">
            <span>0</span>
            <span>{TARGET_SCORE} (Good)</span>
            <span>{MAX_SCORE}</span>
          </div>
          {/* Conditional Message */}
          {score < TARGET_SCORE ? (
            <div className="bg-[#f87171]/20 border border-[#f87171]/30 rounded-xl p-6 mt-4 text-center">
              <div className="text-xl font-bold text-[#f87171] mb-2">
                Improve Your Score!
              </div>
              <div className="text-white mb-2">
                You need <span className="font-bold">{TARGET_SCORE - score}</span> more points ({toTargetPercent}% of total) to reach a good credit score of <span className="font-bold">{TARGET_SCORE}</span>.
              </div>
              <div className="text-[#fbbf24] font-semibold mb-1">Tips to Improve:</div>
              <ul className="text-white text-left mx-auto max-w-xs list-disc list-inside text-sm space-y-1">
                <li>Pay all dues and bills on time.</li>
                <li>Reduce outstanding debts and avoid late payments.</li>
                <li>Maintain a healthy credit mix (loans, cards, etc.).</li>
                <li>Monitor your credit report for errors.</li>
                <li>Avoid multiple new loan applications in a short time.</li>
              </ul>
            </div>
          ) : (
            <div className="bg-[#4f8cfb]/20 border border-[#4f8cfb]/30 rounded-xl p-6 mt-4 text-center">
              <div className="text-xl font-bold text-[#4f8cfb] mb-2">
                Congratulations!
              </div>
              <div className="text-white mb-2">
                Your credit score is above <span className="font-bold">{TARGET_SCORE}</span>. You have a <span className="text-[#a770ef] font-semibold">good credit score</span>!
              </div>
              <div className="text-[#a770ef] font-semibold">
                You are eligible to apply for loans from leading banks and financial institutions.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
