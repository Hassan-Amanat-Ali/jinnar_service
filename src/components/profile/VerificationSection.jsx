import React, { useState } from 'react';
import { useStartVerificationMutation } from '../../services/verificationApi';
import { Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VerificationSection = ({ user }) => {
    const [startVerification, { isLoading }] = useStartVerificationMutation();
    const [error, setError] = useState(null);

    const handleVerify = async (force = false) => {
        setError(null);
        try {
            // Pass { force: true } if restarting, otherwise empty for standard start
            const args = force ? { force: true } : {};
            const data = await startVerification(args).unwrap();

            if (data.verificationUrl) {
                // Redirect to Didit
                window.location.href = data.verificationUrl;
            } else if (data.status === 'verified') {
                toast.success('You are already verified!');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to start verification. Please try again.');
            toast.error('Failed to start verification.');
        }
    };

    const handleRestart = () => {
        handleVerify(true);
    };

    const verification = user?.verification || {};
    const status = verification.status || 'none';

    if (status === 'verified' || status === 'approved') {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                <CheckCircle size={20} />
                <span className="font-medium">Identity Verified</span>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className="flex items-center justify-between bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700">
                    <Clock size={20} />
                    <span className="font-medium">Verification Pending...</span>
                </div>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => handleVerify(false)}
                        disabled={isLoading}
                        className="text-sm font-medium text-yellow-700 hover:text-yellow-800 underline disabled:opacity-50"
                    >
                        Continue
                    </button>
                    <button
                        onClick={handleRestart}
                        disabled={isLoading}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 px-4 py-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
                <Shield className="text-[#74C7F2] mt-1" size={20} />
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Identity Verification</h4>
                    <p className="text-sm text-gray-600 mb-3">
                        Verify your identity to build trust and unlock more features.
                    </p>

                    <button
                        onClick={() => handleVerify(false)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-gray-900 font-medium rounded-lg hover:from-[#74C7F2] hover:to-[#B6E0FE] transition-all text-sm disabled:opacity-70"
                    >
                        {isLoading ? 'Starting...' : 'Verify Now'}
                    </button>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default VerificationSection;
