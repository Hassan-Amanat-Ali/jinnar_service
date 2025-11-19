import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Charts = ({ walletData }) => {
  const navigate = useNavigate();
  
  // Get wallet balance and earnings from API
  const balance = walletData?.balance || walletData?.data?.balance || 0;
  const monthlyEarnings = walletData?.monthlyEarnings || walletData?.data?.monthlyEarnings || 0;
  const weeklyEarnings = walletData?.weeklyEarnings || walletData?.data?.weeklyEarnings || [];
  
  // Format earnings data for chart
  const earningsData = weeklyEarnings.length > 0 
    ? weeklyEarnings.map((earning, index) => ({
        week: `W${index + 1}`,
        earnings: earning.amount || 0
      }))
    : [
        { week: "W1", earnings: 0 },
        { week: "W2", earnings: 0 },
        { week: "W3", earnings: 0 },
        { week: "W4", earnings: 0 },
      ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-5 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Overview */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Earnings Overview
            </h3>
          </div>

          {/* Bar Chart */}
          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={earningsData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="earningsGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#A8D8F0" />
                    <stop offset="100%" stopColor="#74C7F2" />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <YAxis hide />

                <Bar
                  dataKey="earnings"
                  fill="url(#earningsGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <hr className="mb-4 text-gray-400" />

          {/* Total this month */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Total this month: {formatCurrency(monthlyEarnings)}
            </span>
            <TrendingUp className="w-4 h-4 text-[#74C7F2]" />
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Wallet Balance
          </h3>

          {/* Wallet Icon Circle */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] rounded-full flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Balance Amount */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(balance)}
            </div>
            <div className="text-sm text-gray-500">
              Available for withdrawal
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-[#A8D8F0] to-[#74C7F2] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Withdraw Now
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
