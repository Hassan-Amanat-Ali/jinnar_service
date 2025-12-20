import React, { useState, useEffect } from "react";
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
  ChevronRight,
  Globe,
} from "lucide-react";
import {
  useGetWalletQuery,
  useDepositMoneyMutation,
  useWithdrawWalletMutation,
} from "../../services/workerApi";

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
  const [step, setStep] = useState(1); // 1: amount, 2: countries, 3: providers, 4: phone, 5: processing
  const [amount, setAmount] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Fetch countries and providers on modal open
  useEffect(() => {
    if (isOpen && step === 2) {
      fetchCountriesAndProviders();
    }
  }, [isOpen, step]);

  const fetchCountriesAndProviders = async () => {
    setLoadingCountries(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.jinnar.com/api/wallet/countries-providers?operationType=DEPOSIT`,
        
      );
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      if (data.success && data.countries) {
        setCountries(data.countries);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load payment methods. Please try again.");
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleAmountNext = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedProvider(null);
    setProviders(country.providers || []);
    setStep(3);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    // Use first available currency code from provider
    if (provider.currencies && provider.currencies.length > 0) {
      setSelectedCurrency(provider.currencies[0].code || provider.currencies[0]);
    }
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!amount || !selectedCountry || !selectedProvider || !phoneNumber) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const depositData = {
        provider: selectedProvider.providerId,
        country: selectedCountry.countryCode,
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        currency: selectedCurrency,
      };

      await onDeposit(depositData);
      setStep(5);
      
      setTimeout(() => {
        onClose();
        resetModal();
      }, 2000);
    } catch (error) {
      console.error("Deposit error:", error);
      setError(
        error?.data?.message || error?.message || "Failed to deposit money. Please try again."
      );
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount("");
    setSelectedCountry(null);
    setSelectedProvider(null);
    setSelectedCurrency(null);
    setPhoneNumber("");
    setError("");
    setCountries([]);
    setProviders([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Deposit Money</h2>
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                s <= step ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4">
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
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={handleAmountNext}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Countries */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Country
              </label>
              {loadingCountries ? (
                <div className="text-center py-8 text-gray-500">
                  Loading countries...
                </div>
              ) : countries.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.countryCode}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center gap-3"
                    >
                      <img
                        src={country.flag}
                        alt={country.countryName}
                        className="w-6 h-6 rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {country.countryName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.providers?.length || 0} payment methods
                        </div>
                      </div>
                      <ChevronRight className="ml-auto" size={16} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No countries available
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: Providers */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="text-sm text-gray-600 mb-3">
                  {selectedCountry?.countryName}
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {providers.map((provider) => (
                  <button
                    key={provider.providerId}
                    type="button"
                    onClick={() => handleProviderSelect(provider)}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center gap-3"
                  >
                    <img
                      src={provider.logo}
                      alt={provider.displayName}
                      className="w-8 h-8 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {provider.displayName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {provider.currencies?.length || 0} currencies
                      </div>
                    </div>
                    <ChevronRight className="ml-auto" size={16} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Phone Number */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  <div>
                    <span className="font-medium">Country:</span> {selectedCountry?.countryName}
                  </div>
                  <div>
                    <span className="font-medium">Provider:</span> {selectedProvider?.displayName}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> TZS {parseFloat(amount).toLocaleString()}
                  </div>
                </div>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={`+${selectedCountry?.prefix} XXXXXXXXXX`}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !phoneNumber}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Processing..." : "Deposit"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Deposit Successful
              </h3>
              <p className="text-gray-600">
                Your deposit of TZS {parseFloat(amount).toLocaleString()} has been processed.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Withdraw Modal Component
const WithdrawModal = ({ isOpen, onClose, onWithdraw, availableBalance }) => {
  const [step, setStep] = useState(1); // 1: amount, 2: countries, 3: providers, 4: phone, 5: processing
  const [amount, setAmount] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Fetch countries and providers on modal open
  useEffect(() => {
    if (isOpen && step === 2) {
      fetchCountriesAndProviders();
    }
  }, [isOpen, step]);

  const fetchCountriesAndProviders = async () => {
    setLoadingCountries(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.jinnar.com/api/wallet/countries-providers?operationType=PAYOUT`,
      
      );
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      if (data.success && data.countries) {
        setCountries(data.countries);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load payment methods. Please try again.");
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleAmountNext = () => {
    const withdrawAmount = parseFloat(amount);
    if (!amount || withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (withdrawAmount > availableBalance) {
      setError("Insufficient balance");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedProvider(null);
    setProviders(country.providers || []);
    setStep(3);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    // Use first available currency code from provider
    if (provider.currencies && provider.currencies.length > 0) {
      setSelectedCurrency(provider.currencies[0].code || provider.currencies[0]);
    }
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!amount || !selectedCountry || !selectedProvider || !phoneNumber) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const withdrawData = {
        provider: selectedProvider.providerId,
        country: selectedCountry.countryCode,
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        currency: selectedCurrency,
      };

      await onWithdraw(withdrawData);
      setStep(5);
      
      setTimeout(() => {
        onClose();
        resetModal();
      }, 2000);
    } catch (error) {
      console.error("Withdraw error:", error);
      setError(
        error?.data?.message || error?.message || "Failed to withdraw money. Please try again."
      );
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setAmount("");
    setSelectedCountry(null);
    setSelectedProvider(null);
    setSelectedCurrency(null);
    setPhoneNumber("");
    setError("");
    setCountries([]);
    setProviders([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Withdraw Money</h2>
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                s <= step ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Available Balance</div>
                <div className="text-xl font-bold text-blue-900">
                  TZS {availableBalance?.toLocaleString() || '0'}
                </div>
              </div>
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
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={handleAmountNext}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Countries */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Country
              </label>
              {loadingCountries ? (
                <div className="text-center py-8 text-gray-500">
                  Loading countries...
                </div>
              ) : countries.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.countryCode}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center gap-3"
                    >
                      <img
                        src={country.flag}
                        alt={country.countryName}
                        className="w-6 h-6 rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {country.countryName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.providers?.length || 0} payment methods
                        </div>
                      </div>
                      <ChevronRight className="ml-auto" size={16} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No countries available
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: Providers */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="text-sm text-gray-600 mb-3">
                  {selectedCountry?.countryName}
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {providers.map((provider) => (
                  <button
                    key={provider.providerId}
                    type="button"
                    onClick={() => handleProviderSelect(provider)}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center gap-3"
                  >
                    <img
                      src={provider.logo}
                      alt={provider.displayName}
                      className="w-8 h-8 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {provider.displayName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {provider.currencies?.length || 0} currencies
                      </div>
                    </div>
                    <ChevronRight className="ml-auto" size={16} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Phone Number */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  <div>
                    <span className="font-medium">Country:</span> {selectedCountry?.countryName}
                  </div>
                  <div>
                    <span className="font-medium">Provider:</span> {selectedProvider?.displayName}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> TZS {parseFloat(amount).toLocaleString()}
                  </div>
                </div>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={`+${selectedCountry?.prefix} XXXXXXXXXX`}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !phoneNumber}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Withdrawal Successful
              </h3>
              <p className="text-gray-600">
                Your withdrawal of TZS {parseFloat(amount).toLocaleString()} has been processed.
              </p>
            </div>
          )}
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
