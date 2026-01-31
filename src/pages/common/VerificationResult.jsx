import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyProfileQuery as useGetCustomerProfileQuery } from "../../services/customerApi";
import { useGetMyProfileQuery as useGetWorkerProfileQuery } from "../../services/workerApi";
import { ROLES } from "../../constants/roles";
import { CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';

const VerificationResult = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const isCustomer = role === ROLES.CUSTOMER;

    const customerProfileQuery = useGetCustomerProfileQuery(undefined, {
        skip: !isCustomer,
        pollingInterval: 3000,
    });

    const workerProfileQuery = useGetWorkerProfileQuery(undefined, {
        skip: isCustomer,
        pollingInterval: 3000,
    });

    const { data: profileData, isLoading, error } = isCustomer ? customerProfileQuery : workerProfileQuery;

    const [status, setStatus] = useState('checking');
    const [checkCount, setCheckCount] = useState(0);

    useEffect(() => {
        if (!profileData?.profile) return;

        const verificationStatus = profileData.profile.verification?.status || 'none';

        if (verificationStatus === 'verified' || verificationStatus === 'approved') {
            setStatus('success');
            setTimeout(() => navigate('/profile'), 3000);
        } else if (verificationStatus === 'rejected') {
            setStatus('rejected');
        } else if (verificationStatus === 'pending') {
            setStatus('pending');
        } else {
            // If we've checked many times and it's still not verifying, maybe show a button?
            if (checkCount > 10) {
                // stay on checking but maybe change UI message?
            }
        }
    }, [profileData, navigate, checkCount]);

    // Increment check count on poll
    useEffect(() => {
        if (profileData) {
            setCheckCount(prev => prev + 1);
        }
    }, [profileData]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                {status === 'checking' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin text-[#74C7F2] mb-4">
                            <Loader size={48} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Checking verification status...</h2>
                        <p className="text-gray-500 mt-2 mb-6">Please wait while we confirm your identity.</p>

                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-[#74C7F2] hover:underline"
                        >
                            Refresh Status
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="mt-4 text-xs text-gray-400 hover:text-gray-600 block"
                        >
                            Back to Profile
                        </button>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="text-green-500 mb-4 bg-green-50 p-4 rounded-full">
                            <CheckCircle size={48} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h1>
                        <p className="text-gray-600">Your identity has been verified. Redirecting you back to profile...</p>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="flex flex-col items-center">
                        <div className="text-red-500 mb-4 bg-red-50 p-4 rounded-full">
                            <AlertCircle size={48} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                        <p className="text-gray-600 mb-6">We couldn't verify your identity. Please try again or contact support.</p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors w-full"
                        >
                            Return to Profile
                        </button>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="flex flex-col items-center">
                        <div className="text-yellow-500 mb-4 bg-yellow-50 p-4 rounded-full">
                            <Clock size={48} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification In Review</h1>
                        <p className="text-gray-600 mb-6">We have received your documents. You will be notified once verified.</p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors w-full"
                        >
                            Return to Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationResult;
