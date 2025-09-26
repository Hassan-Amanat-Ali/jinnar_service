import React, { useState } from "react";
import Hero from "../../components/common/Hero";
import {
  Wallet as WalletIcon,
  TrendingUp,
  ArrowUp,
  Plus,
  MoreVertical,
  Home,
  Wrench,
  Zap,
  Droplets,
  Scissors,
  Trees,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Stats Card Component
const StatsCard = ({ title, amount, icon, iconBg, hasAlert = false }) => (
  <div className="relative rounded-2xl bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] p-5 text-white overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium opacity-90">{title}</span>
        <div className={`p-2 rounded-lg ${iconBg || "bg-white/20"}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">{amount}</div>
      {hasAlert && (
        <div className="flex items-center gap-1 mt-2 text-xs">
          <AlertCircle size={12} className="text-orange-200" />
          <span className="text-orange-100">Withdraw Now</span>
        </div>
      )}
    </div>
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
      <div className="w-full h-full bg-white/20 rounded-full transform translate-x-6 -translate-y-6"></div>
    </div>
  </div>
);

// Chart Section
const EarningsChart = () => {
  const chartData = [
    { name: "Mon", value: 80000 },
    { name: "Tue", value: 120000 },
    { name: "Wed", value: 60000 },
    { name: "Thu", value: 90000 },
    { name: "Fri", value: 110000 },
    { name: "Sat", value: 130000 },
    { name: "Sun", value: 95000 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Earnings Overview</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +26% vs last week
            </span>
          </div>
        </div>
        <button className="text-sky-600 text-sm font-medium hover:text-sky-700">
          View Details
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis hide />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#74C7F2">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 5 ? "#3B82F6" : "#74C7F2"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-sm text-gray-600">This Week</div>
          <div className="text-lg font-bold text-gray-900">TZS 130,000</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Last Week</div>
          <div className="text-lg font-bold text-gray-900">TZS 95,000</div>
        </div>
      </div>
    </div>
  );
};

// Quick Stats Sidebar
const QuickStats = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-900 mb-4">Quick Stats</h3>

      <div className="space-y-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-green-800 text-lg font-bold">TZS 120,000</div>
          <div className="text-green-600 text-sm">This Week</div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp className="text-blue-600" size={16} />
            <span className="text-blue-800 text-lg font-bold">+26%</span>
          </div>
          <div className="text-blue-600 text-sm">Growth in Last Week</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-purple-800 text-lg font-bold">5</div>
          <div className="text-purple-600 text-sm">Completed Jobs</div>
        </div>
      </div>
    </div>

    <LinkedAccounts />
  </div>
);

// Linked Accounts Section
const LinkedAccounts = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-900">Linked Accounts</h3>
      <button className="text-sky-600 text-sm font-medium hover:text-sky-700">
        + Add
      </button>
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-xs font-bold">MP</span>
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900">M-Pesa</div>
            <div className="text-xs text-gray-500">**** 1234</div>
          </div>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Primary
        </span>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xs font-bold">CB</span>
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900">CRDB Bank</div>
            <div className="text-xs text-gray-500">**** 5678</div>
          </div>
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          Pending
        </span>
      </div>
    </div>

    <button className="w-full mt-4 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium text-sm py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
      <ArrowUp size={16} />
      Withdraw Now
    </button>
  </div>
);

// Service Icon Helper
const getServiceIcon = (service) => {
  const icons = {
    "House Cleaning": <Home size={16} />,
    "Plumbing Repair": <Droplets size={16} />,
    "Withdrawal to M-Pesa": <WalletIcon size={16} />,
    "Electrical Installation": <Zap size={16} />,
    "Platform Fee": <Scissors size={16} />,
    "Garden Maintenance": <Trees size={16} />,
    "Carpentry Work": <Wrench size={16} />,
  };
  return icons[service] || <Wrench size={16} />;
};

// Transaction Row Component
const TransactionRow = ({ transaction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={12} />;
      case "Pending":
        return <Clock size={12} />;
      case "Cancelled":
        return <X size={12} />;
      default:
        return <AlertCircle size={12} />;
    }
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
      <td className="py-4 px-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              transaction.type === "withdrawal"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {getServiceIcon(transaction.service)}
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900">
              {transaction.service}
            </div>
            <div className="text-xs text-gray-500">{transaction.date}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-1">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            transaction.status
          )}`}
        >
          {getStatusIcon(transaction.status)}
          {transaction.status}
        </span>
      </td>
      <td className="py-4 px-1 text-right">
        <div
          className={`font-bold text-sm ${
            transaction.type === "withdrawal"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {transaction.type === "withdrawal" ? "-" : "+"}
          {transaction.amount}
        </div>
      </td>
    </tr>
  );
};

// Transaction History Section
const TransactionHistory = () => {
  const [filter, setFilter] = useState("All");

  const transactions = [
    {
      id: 1,
      service: "House Cleaning",
      date: "Dec 16, 2023 • 2:35 PM",
      status: "Completed",
      amount: "TZS 25,000",
      type: "earning",
    },
    {
      id: 2,
      service: "Plumbing Repair",
      date: "Dec 15, 2023 • 11:30 AM",
      status: "Completed",
      amount: "TZS 50,000",
      type: "earning",
    },
    {
      id: 3,
      service: "Withdrawal to M-Pesa",
      date: "Dec 14, 2023 • 09:15 AM",
      status: "Completed",
      amount: "TZS 800,000",
      type: "withdrawal",
    },
    {
      id: 4,
      service: "Electrical Installation",
      date: "Dec 13, 2023 • 04:22 PM",
      status: "Pending",
      amount: "TZS 75,000",
      type: "earning",
    },
    {
      id: 5,
      service: "Platform Fee",
      date: "Dec 12, 2023 • 12:00 PM",
      status: "Completed",
      amount: "TZS 5,750",
      type: "withdrawal",
    },
    {
      id: 6,
      service: "Garden Maintenance",
      date: "Dec 11, 2023 • 10:00 AM",
      status: "Completed",
      amount: "TZS 30,000",
      type: "earning",
    },
    {
      id: 7,
      service: "Carpentry Work",
      date: "Dec 10, 2023 • 02:30 PM",
      status: "Cancelled",
      amount: "TZS 80,000",
      type: "earning",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
        <button className="text-sky-600 text-sm font-medium hover:text-sky-700 flex items-center gap-1">
          All Time
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-full overflow-x-auto sm:w-fit">
        {["All", "Completed", "Pending", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <tbody>
            {filteredTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Wallet = () => {
  return (
    <div>
      <Hero
        place="wallet"
        title="Wallet"
        subtitle="Manage your earnings and payments"
        className="h-[7rem] sm:h-[8rem] md:h-[12rem] lg:h-[12rem]"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Balance"
                amount="TZS 540,000"
                icon={<WalletIcon size={20} />}
                iconBg="bg-white/20"
                hasAlert
              />
              <StatsCard
                title="Pending Payments"
                amount="TZS 120,000"
                icon={<Clock size={20} />}
                iconBg="bg-white/20"
              />
              <StatsCard
                title="Available for Withdrawal"
                amount="TZS 400,000"
                icon={<ArrowUp size={20} />}
                iconBg="bg-white/20"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Chart and Transactions */}
              <div className="lg:col-span-2 space-y-6">
                <EarningsChart />
                <TransactionHistory />
              </div>

              {/* Right Column - Quick Stats and Linked Accounts */}
              <div className="lg:col-span-1">
                <QuickStats />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wallet;
