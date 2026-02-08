"use client";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);

  async function calculateRisk() {
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    );
    const priceData = await priceRes.json();
    const ethPrice = priceData.ethereum.usd;

    const tradeValueUSD = Number(amount) * ethPrice;

    let riskScore = 20;
    let reasons = [];

    if (tradeValueUSD > 1000) {
      riskScore += 30;
      reasons.push("Large trade size relative to assumed liquidity");
    }

    if (ethPrice > 3000) {
      riskScore += 20;
      reasons.push("High market price volatility");
    }

    if (reasons.length === 0) {
      reasons.push("Normal trade size and stable pricing");
    }

    setResult({
      score: Math.min(riskScore, 100),
      level: riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW",
      reasons,
    });
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-neutral-900 rounded-2xl border border-neutral-800">
        <h1 className="text-2xl font-semibold mb-4">SignalScore</h1>

        <p className="text-neutral-400 mb-4">
          Check risk before swapping ETH → USDC
        </p>

        <input
          type="number"
          placeholder="ETH amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-xl bg-neutral-800 outline-none mb-4"
        />

        <button
          onClick={calculateRisk}
          className="w-full bg-white text-black py-3 rounded-xl font-medium"
        >
          Assess Risk
        </button>

        {result && (
          <div className="mt-6 p-4 bg-neutral-800 rounded-xl">
            <p className="text-lg font-semibold">
              Risk Score: {result.score}/100
            </p>
            <p className="text-sm text-neutral-400 mb-2">
              Level: {result.level}
            </p>
            <ul className="text-sm list-disc list-inside">
              {result.reasons.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
