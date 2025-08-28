import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';

const RoleSelection = () => {
  const { setRole } = useAuth();
  return (
    <div className='max-w-xl mx-auto p-6 space-y-4'>
      <h1 className='text-xl font-semibold'>Choose your role</h1>
      <div className='grid grid-cols-2 gap-4'>
        <Link
          to='/c'
          onClick={() => setRole(ROLES.CUSTOMER)}
          className='border rounded p-8 text-center'
        >
          Customer
        </Link>
        <Link
          to='/w'
          onClick={() => setRole(ROLES.WORKER)}
          className='border rounded p-8 text-center'
        >
          Worker
        </Link>
      </div>
    </div>
  );
};

export default RoleSelection;
