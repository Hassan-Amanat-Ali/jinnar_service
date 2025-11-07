import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';
import { User, Lightbulb, ArrowRight, UserRound } from 'lucide-react';

const RoleSelection = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // next indicates whether user intended to login or signup
  const next = (location.state && location.state.next) || 'login';

  const handleRoleSelection = (role) => {
    // Store role in localStorage
    localStorage.setItem('userRole', role);

    // Set role in context
    setRole(role);

    // Navigate to next page (login or signup)
    navigate(next === 'signup' ? '/signup' : '/login');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='max-w-4xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Choose Your Role
          </h1>
          <p className='text-base text-gray-600'>
            Select how you want to use our platform.
          </p>
        </div>

        {/* Role Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Customer Card */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow'>
            {/* Icon */}
            <div className='w-20 h-20 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2]  rounded-full flex items-center justify-center mx-auto mb-6'>
              <UserRound className='text-white' size={40} />
            </div>

            {/* Title */}
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              I'm Customer
            </h2>

            {/* Description */}
            <p className='text-gray-600 mb-6'>
              Book trusted workers for any service you need quickly and
              securely.
            </p>

            {/* Features List */}
            <ul className='text-sm text-left text-gray-600 space-y-2 mb-8'>
              <li>• Browse verified professionals</li>
              <li>• Compare prices and reviews</li>
              <li>• Secure payment protection</li>
              <li>• 24/7 customer support</li>
            </ul>

            {/* Button */}
            <button
              onClick={() => handleRoleSelection(ROLES.CUSTOMER)}
              className='inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-opacity w-full'
            >
              Continue as Customer
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Worker Card */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow'>
            {/* Icon */}
            <div className='w-20 h-20 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] rounded-full flex items-center justify-center mx-auto mb-6'>
              <Lightbulb className='text-white' size={40} />
            </div>

            {/* Title */}
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              I'm Worker
            </h2>

            {/* Description */}
            <p className='text-gray-600 mb-6'>
              Offer your skills and connect with customers in your area.
            </p>

            {/* Features List */}
            <ul className='text-sm text-left text-gray-600 space-y-2 mb-8'>
              <li>• Create your professional profile</li>
              <li>• Set your own rates</li>
              <li>• Get matched with local jobs</li>
              <li>• Fast and secure payments</li>
            </ul>

            {/* Button */}
            <button
              onClick={() => handleRoleSelection(ROLES.WORKER)}
              className='inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-opacity w-full'
            >
              Continue as Worker
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className='text-center mt-8'>
          <p className='text-sm text-gray-500'>
            You can change your role type anytime in your account settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
