import React, { useState } from "react";
import Hero from "../../components/common/Hero";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  X,
  Clock,
  CheckCircle,
  CreditCard,
  Smartphone,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  useGetWalletQuery,
  useDepositMoneyMutation,
  useWithdrawWalletMutation,
} from "../../services/workerApi";

// Tanzania Mobile Money Providers with correct API format
const providers = [
  { id: "AIRTEL_TZA", name: "Airtel Money", color: "red" },
  { id: "HALOTEL_TZA", name: "Halotel Money", color: "purple" },
];

// Stats Card Component
const StatsCard = ({ title, amount, icon, gradient, description }) => (
  <div className={`relative rounded-2xl ${gradient} p-6 text-white overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-90">{title}</span>
        <div className="p-2 rounded-lg bg-white/20">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{amount}</div>
      <div className="text-xs opacity-75">{description}</div>
    </div>
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
      <div className="w-full h-full bg-white/20 rounded-full transform translate-x-8 -translate-y-8"></div>
    </div>
  </div>
);

// Transaction Item Component
const TransactionItem = ({ type, amount, createdAt, status, paymentMethod, description }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
      <div className={`p-3 rounded-full ${type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'}`}>
        {type === 'deposit' ? (
          <ArrowDownLeft className={`w-5 h-5 ${type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`} />
        ) : (
          <ArrowUpRight className={`w-5 h-5 ${type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`} />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-900">{description}</h4>
          <span className={`text-sm font-bold ${type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`}>
            {type === 'deposit' ? '+' : '-'}TZS {amount?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatDate(createdAt)}</span>
          <span>•</span>
          <span>{paymentMethod || 'Unknown'}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-700' :
            status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

// Deposit Modal Component
const DepositModal = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !selectedProvider || !phoneNumber) return;

    setIsLoading(true);
    setError("");
    
    try {
      const depositData = {
        provider: selectedProvider,
        amount: parseFloat(amount),
        currency: "TZS",
        country: "TZA",
        phoneNumber: phoneNumber.startsWith("255") ? phoneNumber : `255${phoneNumber.replace(/^0+/, "")}`
      };

      await onDeposit(depositData);
      setAmount("");
      setSelectedProvider("");
      setPhoneNumber("");
      setError("");
      onClose();
    } catch (error) {
      console.error("Deposit error:", error);
      setError(error?.data?.message || error?.message || "Failed to deposit money. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Deposit Money</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (TZS)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="100"
              required
            />
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedProvider === provider.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {provider.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Phone Number */}
          {selectedProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (e.g., 0683456129 or 255683456129)"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount || !selectedProvider || !phoneNumber}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : "Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Withdraw Modal Component
const WithdrawModal = ({ isOpen, onClose, onWithdraw, availableBalance }) => {
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !selectedProvider || !phoneNumber) return;

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > availableBalance) {
      setError("Insufficient balance");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const withdrawData = {
        provider: selectedProvider,
        amount: withdrawAmount,
        currency: "TZS",
        country: "TZA",
        phoneNumber: phoneNumber.startsWith("255") ? phoneNumber : `255${phoneNumber.replace(/^0+/, "")}`
      };

      await onWithdraw(withdrawData);
      setAmount("");
      setSelectedProvider("");
      setPhoneNumber("");
      setError("");
      onClose();
    } catch (error) {
      console.error("Withdraw error:", error);
      setError(error?.data?.message || error?.message || "Failed to withdraw money. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Withdraw Money</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Available Balance */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Available Balance</div>
            <div className="text-xl font-bold text-blue-900">
              TZS {availableBalance?.toLocaleString() || '0'}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (TZS)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              max={availableBalance}
              min="100"
              required
            />
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedProvider === provider.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {provider.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Phone Number */}
          {selectedProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (e.g., 0683456129 or 255683456129)"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount || !selectedProvider || !phoneNumber}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Wallet Component
const Wallet = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  // API Queries and Mutations
  // Using RTK Query's automatic cache invalidation - refetches when mutations complete
  const { data: walletData, isLoading, error: walletError, refetch } = useGetWalletQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [depositMoney] = useDepositMoneyMutation();
  const [withdrawWallet] = useWithdrawWalletMutation();

  // Handle deposit
  const handleDeposit = async (depositData) => {
    try {
      await depositMoney(depositData).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to deposit:", error);
      throw error;
    }
  };

  // Handle withdraw
  const handleWithdraw = async (withdrawData) => {
    try {
      await withdrawWallet(withdrawData).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to withdraw:", error);
      throw error;
    }
  };

  // Extract data from API response
  const balance = walletData?.balance || 0;
  const transactions = walletData?.transactions || [];

  // Calculate stats from real transactions
  const deposits = transactions.filter(t => t.type === 'deposit');
  const withdrawals = transactions.filter(t => t.type === 'withdrawal');
  
  const totalDeposits = deposits.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "All") return true;
    if (filter === "Deposits") return transaction.type === "deposit";
    if (filter === "Withdrawals") return transaction.type === "withdrawal";
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading wallet...</div>
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error loading wallet</div>
          <div className="text-sm text-gray-500">
            {walletError?.data?.message || walletError?.message || "Please try refreshing the page"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero
        place="wallet"
        title="Wallet"
        subtitle="Manage your earnings and payments"
        className="h-28 sm:h-32 md:h-48 lg:h-48"
      />

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Balance"
                amount={`TZS ${balance.toLocaleString()}`}
                icon={<WalletIcon size={24} />}
                gradient="bg-gradient-to-r from-blue-500 to-purple-600"
                description="Available for withdrawal"
              />
              <StatsCard
                title="Total Deposits"
                amount={`TZS ${totalDeposits.toLocaleString()}`}
                icon={<ArrowDownLeft size={24} />}
                gradient="bg-gradient-to-r from-green-500 to-emerald-600"
                description={`${deposits.length} transactions`}
              />
              <StatsCard
                title="Total Withdrawals"
                amount={`TZS ${totalWithdrawals.toLocaleString()}`}
                icon={<ArrowUpRight size={24} />}
                gradient="bg-gradient-to-r from-orange-500 to-red-600"
                description={`${withdrawals.length} transactions`}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Plus size={20} />
                  Deposit Money
                </button>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <ArrowUpRight size={20} />
                  Withdraw Money
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {transactions.length} total transactions
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                    title="Refresh transactions"
                  >
                    <RefreshCw
                      size={18}
                      className="text-gray-600 group-hover:text-blue-600 group-active:animate-spin"
                    />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                {["All", "Deposits", "Withdrawals"].map((tab) => (
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

              {/* Transactions List */}
              <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <TransactionItem key={transaction._id || index} {...transaction} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No transactions found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />
      
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        availableBalance={balance}
      />
    </div>
  );
};

export default Wallet;
