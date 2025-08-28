import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className='min-h-dvh flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
