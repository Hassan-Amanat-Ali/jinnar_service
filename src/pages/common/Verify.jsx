import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { ROLES } from '../../constants/roles';
import { toast } from 'react-toastify';

const Verify = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const state = loc.state || {};
  const mobile = state.mobile || '';
  const role = state.role || ROLES.CUSTOMER;
  const action = state.action || 'signup'; // 'signup' or 'signin'

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      let res;
      if (action === 'signup') {
        res = await authApi.verifySignup({
          mobileNumber: mobile,
          code,
          role: role === ROLES.CUSTOMER ? 'buyer' : 'seller',
        });
      } else {
        res = await authApi.verifySignin({ mobileNumber: mobile, code });
      }

      // Expect token in response on successful verification
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', role);
        toast.success('Verification successful');
        if (role === ROLES.CUSTOMER) navigate('/customer-home');
        else navigate('/worker-home');
      } else {
        // If no token, still provide feedback and fallback
        toast.success('Verification successful — no token returned');
        navigate('/');
      }
    } catch (err) {
      const payload = err?.response?.data || err;
      if (typeof payload === 'string') toast.error(payload);
      else if (payload && Array.isArray(payload.errors))
        payload.errors.forEach((e) => toast.error(e.msg || JSON.stringify(e)));
      else if (payload?.message) toast.error(payload.message);
      else toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-dvh flex items-center justify-center pt-24'>
      <div className='w-full max-w-md p-6 rounded-2xl border border-gray-200 shadow-sm'>
        <h2 className='text-xl font-semibold mb-3'>Enter verification code</h2>
        <p className='text-sm text-gray-600 mb-4'>
          A verification code was sent to <strong>{mobile}</strong>. Enter it
          below.
        </p>

        <form onSubmit={handleVerify}>
          <label className='block text-sm font-medium text-gray-700'>
            Verification code
          </label>
          <input
            type='text'
            placeholder='Enter the code you received'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className='mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#74C7F2] focus:border-transparent'
          />

          <button
            type='submit'
            disabled={loading}
            className='mt-5 h-11 w-full rounded-full text-white text-sm font-medium shadow-sm'
            style={{ background: 'var(--gradient-main)' }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
