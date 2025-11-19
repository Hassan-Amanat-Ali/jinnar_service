import React, { useState } from "react";
import Hero from "../../components/common/Hero";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react";
import {
  useGetWalletQuery,
  useDepositMoneyMutation,
  useWithdrawWalletMutation,
} from "../../services/customerApi";

// Stats Card Component
const StatsCard = ({ title, amount, icon, gradient, description }) => (
  <div className={`relative rounded-2xl ${gradient} p-6 text-white overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
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
const TransactionItem = ({ type, amount, createdAt, status, paymentMethod, description, _id }) => {
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
const DepositModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: amount, 2: providers, 3: phone, 4: processing
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Static providers with correspondent mapping
  const providers = [
    { id: 'airtel', name: 'Airtel', correspondent: 'AIRTEL_TZA', description: 'Airtel Money' },
    { id: 'vodacom', name: 'Vodacom', correspondent: 'VODACOM_TZA', description: 'M-Pesa' },
    { id: 'tigo', name: 'Tigo', correspondent: 'TIGO_TZA', description: 'Tigo Pesa' },
    { id: 'halotel', name: 'Halotel', correspondent: 'HALOTEL_TZA', description: 'HaloPesa' },
  ];

  const [depositMoney, { isLoading: isDepositing }] = useDepositMoneyMutation();

  const handleAmountNext = () => {
    if (amount && parseFloat(amount) > 0) {
      setStep(2);
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleProviderNext = () => {
    if (selectedProvider) {
      setStep(3);
    }
  };

  const handlePhoneNext = () => {
    if (phoneNumber) {
      setStep(4);
      handleDeposit();
    }
  };

  const handleDeposit = async () => {
    if (!selectedProvider || !phoneNumber) return;
    
    try {
      const result = await depositMoney({
        provider: selectedProvider.correspondent,
        amount: parseFloat(amount),
        currency: "TZS",
        country: "TZA",
        phoneNumber: phoneNumber.startsWith("255") ? phoneNumber : `255${phoneNumber.replace(/^0+/, "")}`,
      }).unwrap();
      
      // Success - close modal
      setTimeout(() => {
        onClose();
        setStep(1);
        setAmount('');
        setPhoneNumber('');
        setSelectedProvider(null);
      }, 2000);
    } catch (error) {
      console.error("Deposit error:", error);
      alert(error?.data?.message || error?.message || 'Deposit failed. Please try again.');
      setStep(3);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount('');
    setPhoneNumber('');
    setSelectedProvider(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Deposit Money</h3>
          <button onClick={resetModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Amount (TZS)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to deposit"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAmountNext}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-3 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select Provider</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider)}
                      className={`w-full p-3 border rounded-xl text-left transition-colors ${
                        selectedProvider?.id === provider.id
                          ? 'border-[#74C7F2] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedProvider}
                  className="flex-1 py-3 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handlePhoneNext}
                  disabled={!phoneNumber}
                  className="flex-1 py-3 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deposit TZS {amount}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              {isDepositing ? (
                <div className="space-y-4">
                  <Clock className="w-12 h-12 text-[#74C7F2] mx-auto animate-spin" />
                  <h4 className="text-lg font-semibold text-gray-900">Processing Deposit</h4>
                  <p className="text-gray-600">Please wait while we process your deposit...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <h4 className="text-lg font-semibold text-gray-900">Deposit Successful</h4>
                  <p className="text-gray-600">TZS {amount} has been deposited to your wallet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Withdraw Modal Component
const WithdrawModal = ({ isOpen, onClose, walletBalance }) => {
  const [step, setStep] = useState(1); // 1: amount, 2: providers, 3: phone, 4: processing
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Static providers with correspondent mapping
  const providers = [
    { id: 'airtel', name: 'Airtel', correspondent: 'AIRTEL_TZA', description: 'Airtel Money' },
    { id: 'vodacom', name: 'Vodacom', correspondent: 'VODACOM_TZA', description: 'M-Pesa' },
    { id: 'tigo', name: 'Tigo', correspondent: 'TIGO_TZA', description: 'Tigo Pesa' },
    { id: 'halotel', name: 'Halotel', correspondent: 'HALOTEL_TZA', description: 'HaloPesa' },
  ];

  const [withdrawMoney, { isLoading: isWithdrawing }] = useWithdrawWalletMutation();

  const handleAmountNext = () => {
    if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= walletBalance) {
      setStep(2);
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handlePhoneNext = () => {
    if (phoneNumber) {
      setStep(4);
      handleWithdraw();
    }
  };

  const handleWithdraw = async () => {
    if (!selectedProvider || !phoneNumber) return;
    
    try {
      await withdrawMoney({
        provider: selectedProvider.correspondent,
        amount: parseFloat(amount),
        currency: "TZS",
        country: "TZA",
        phoneNumber: phoneNumber.startsWith("255") ? phoneNumber : `255${phoneNumber.replace(/^0+/, "")}`,
      }).unwrap();
      
      // Success - close modal
      setTimeout(() => {
        onClose();
        setStep(1);
        setAmount('');
        setPhoneNumber('');
        setSelectedProvider(null);
      }, 2000);
    } catch (error) {
      console.error("Withdraw error:", error);
      alert(error?.data?.message || error?.message || 'Withdrawal failed. Please try again.');
      setStep(3);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount('');
    setPhoneNumber('');
    setSelectedProvider(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Withdraw Money</h3>
          <button onClick={resetModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Amount (TZS)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to withdraw"
                  max={walletBalance}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Available balance: TZS {walletBalance?.toLocaleString() || '0'}
                </div>
              </div>
              <button
                onClick={handleAmountNext}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}
                className="w-full py-3 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select Provider</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider)}
                      className={`w-full p-3 border rounded-xl text-left transition-colors ${
                        selectedProvider?.id === provider.id
                          ? 'border-[#74C7F2] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Smartphone size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedProvider}
                  className="flex-1 py-3 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handlePhoneNext}
                  disabled={!phoneNumber}
                  className="flex-1 py-3 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw TZS {amount}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              {isWithdrawing ? (
                <div className="space-y-4">
                  <Clock className="w-12 h-12 text-[#74C7F2] mx-auto animate-spin" />
                  <h4 className="text-lg font-semibold text-gray-900">Processing Withdrawal</h4>
                  <p className="text-gray-600">Please wait while we process your withdrawal...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <h4 className="text-lg font-semibold text-gray-900">Withdrawal Successful</h4>
                  <p className="text-gray-600">TZS {amount} has been withdrawn from your wallet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerWallet = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');

  const { data: wallet, isLoading: walletLoading } = useGetWalletQuery();

  // Use transactions from API response
  const transactions = wallet?.transactions || [];
  
  const filteredTransactions = transactionFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === transactionFilter);

  // Calculate totals from transactions
  const totalDeposited = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawn = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  if (walletLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Hero title="Wallet" subtitle="Manage your payments and transactions" place="Customer" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero title="Wallet" subtitle="Manage your payments and transactions" place="Customer" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Current Balance"
            amount={`TZS ${wallet?.balance?.toLocaleString() || '0'}`}
            icon={<WalletIcon size={24} />}
            gradient="bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8]"
            description="Available for spending"
          />
          <StatsCard
            title="Total Deposited"
            amount={`TZS ${totalDeposited?.toLocaleString() || '0'}`}
            icon={<ArrowDownLeft size={24} />}
            gradient="bg-gradient-to-r from-[#10B981] to-[#059669]"
            description="Lifetime deposits"
          />
          <StatsCard
            title="Total Withdrawn"
            amount={`TZS ${totalWithdrawn?.toLocaleString() || '0'}`}
            icon={<ArrowUpRight size={24} />}
            gradient="bg-gradient-to-r from-[#F59E0B] to-[#D97706]"
            description="Lifetime withdrawals"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 bg-gradient-to-r from-[#74C7F2] to-[#5bb3e8] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Deposit Money
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 border-2 border-[#74C7F2] text-[#74C7F2] py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-[#74C7F2] hover:text-white transition-colors"
          >
            <Minus size={20} />
            Withdraw Money
          </button>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
              <div className="flex gap-2">
                {['all', 'deposit', 'withdrawal'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTransactionFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      transactionFilter === filter
                        ? 'bg-[#74C7F2] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <TransactionItem key={transaction._id} {...transaction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <WalletIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h4>
                <p className="text-gray-600 mb-6">
                  {transactionFilter === 'all' 
                    ? "You haven't made any transactions yet."
                    : `No ${transactionFilter} transactions found.`}
                </p>
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="bg-[#74C7F2] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5bb3e8] transition-colors"
                >
                  Make Your First Deposit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <WithdrawModal 
        isOpen={showWithdrawModal} 
        onClose={() => setShowWithdrawModal(false)} 
        walletBalance={wallet?.balance || 0}
      />
    </div>
  );
};

export default CustomerWallet;
