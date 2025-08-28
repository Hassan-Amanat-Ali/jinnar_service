import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Header = () => {
  const { role } = useAuth();
  return (
    <header className='border-b'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link to='/' className='font-semibold'>
          Tanzania Platform
        </Link>
        <nav className='flex gap-4 text-sm'>
          <Link to='/'>Home</Link>
          <Link to='/role'>Role</Link>
          {role === 'customer' && <Link to='/c'>Customer</Link>}
          {role === 'worker' && <Link to='/w'>Worker</Link>}
        </nav>
      </div>
    </header>
  );
};

export default Header;
