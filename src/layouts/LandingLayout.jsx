import { Outlet, Link, NavLink } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

const LandingHeader = () => {
  return (
    <header className='absolute left-1/2 -translate-x-1/2 top-0 z-30 w-[calc(100%-24px)] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]'>
      <div className='rounded-b-2xl bg-white/50 backdrop-blur shadow-sm px-4 md:px-6 lg:px-8 h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-4'>
        <Link to='/' className='font-semibold tracking-tight'>
          LOGO HERE
        </Link>
        <nav className='hidden md:flex items-center justify-center gap-6 text-sm'>
          {[
            { to: '/', label: 'Home' },
            { to: '/#how-it-works', label: 'How it Works' },
            { to: '/#services', label: 'Services' },
            { to: '/#workers', label: 'Workers' },
            { to: '/#help', label: 'Help' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-[#141414]/70'
                  : 'text-secondary hover:text-secondary'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className='flex items-center justify-end gap-3'>
          <Link
            to='/login'
            className='text-sm font-medium text-black hover:text-black/80 flex items-center gap-2'
          >
            Login
          </Link>
          <Link
            to='/signup'
            className='h-9 px-5 rounded-full text-sm font-medium text-black shadow flex items-center justify-center'
            style={{ background: 'var(--gradient-main)' }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

const LandingLayout = () => {
  return (
    <div className='min-h-dvh flex flex-col'>
      <LandingHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
