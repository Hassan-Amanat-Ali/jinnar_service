import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import LandingLayout from '../layouts/LandingLayout.jsx';
import Landing from '../pages/common/Landing.jsx';
import RoleSelection from '../pages/common/RoleSelection.jsx';
import Login from '../pages/common/Login.jsx';
import Signup from '../pages/common/Signup.jsx';
import Help from '../pages/common/Help.jsx';
import PrivacyPolicy from '../pages/common/PrivacyPolicy.jsx';
import Notifications from '../pages/common/Notifications.jsx';
import Chat from '../pages/common/Chat.jsx';
import Profile from '../pages/common/Profile.jsx';
import Complaint from '../pages/common/Complaint.jsx';
import CustomerHome from '../pages/customer/Home.jsx';
import AllServices from '../pages/customer/AllServices.jsx';
import CustomerBookings from '../pages/customer/MyBookings.jsx';
import BookWorker from '../pages/customer/BookWorker.jsx';
import BookingConfirm from '../pages/customer/BookingConfirm.jsx';
import CustomerBookingDetail from '../pages/customer/BookingDetail.jsx';
import WorkerPublicProfile from '../pages/customer/WorkerProfile.jsx';
import WorkerHome from '../pages/worker/Home.jsx';
import ProfileSetupBasic from '../pages/worker/ProfileSetupBasic.jsx';
import ProfileSetupServices from '../pages/worker/ProfileSetupServices.jsx';
import ProfileSetupPricing from '../pages/worker/ProfileSetupPricing.jsx';
import ProfileSetupAvailability from '../pages/worker/ProfileSetupAvailability.jsx';
import Jobs from '../pages/worker/Jobs.jsx';
import JobDetail from '../pages/worker/JobDetail.jsx';
import WorkerBookings from '../pages/worker/MyBookings.jsx';
import WorkerBookingDetail from '../pages/worker/BookingDetail.jsx';
import Wallet from '../pages/worker/Wallet.jsx';
import CustomerProfile from '../pages/worker/CustomerProfile.jsx';
import PaymentMethods from '../pages/worker/PaymentMethods.jsx';
import RoleGuard from '../components/common/RoleGuard.jsx';
import { ROLES } from '../constants/roles.js';

const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
  {
    element: <MainLayout />,
    children: [
      { path: 'role', element: <RoleSelection /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'help', element: <Help /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'chat', element: <Chat /> },
      { path: 'profile', element: <Profile /> },
      { path: 'complaint', element: <Complaint /> },

      // Customer area
      {
        path: 'c',
        element: (
          <RoleGuard allow={ROLES.CUSTOMER}>
            <div className='p-4'>
              <Outlet />
            </div>
          </RoleGuard>
        ),
        children: [
          { index: true, element: <CustomerHome /> },
          { path: 'services', element: <AllServices /> },
          { path: 'bookings', element: <CustomerBookings /> },
          { path: 'book/:id', element: <BookWorker /> },
          { path: 'booking/confirm', element: <BookingConfirm /> },
          { path: 'booking/:id', element: <CustomerBookingDetail /> },
          { path: 'worker/:id', element: <WorkerPublicProfile /> },
        ],
      },

      // Worker area
      {
        path: 'w',
        element: (
          <RoleGuard allow={ROLES.WORKER}>
            <div className='p-4'>
              <Outlet />
            </div>
          </RoleGuard>
        ),
        children: [
          { index: true, element: <WorkerHome /> },
          { path: 'setup/basic', element: <ProfileSetupBasic /> },
          { path: 'setup/services', element: <ProfileSetupServices /> },
          { path: 'setup/pricing', element: <ProfileSetupPricing /> },
          { path: 'setup/availability', element: <ProfileSetupAvailability /> },
          { path: 'jobs', element: <Jobs /> },
          { path: 'jobs/:id', element: <JobDetail /> },
          { path: 'bookings', element: <WorkerBookings /> },
          { path: 'booking/:id', element: <WorkerBookingDetail /> },
          { path: 'wallet', element: <Wallet /> },
          { path: 'customer/:id', element: <CustomerProfile /> },
          { path: 'payment-methods', element: <PaymentMethods /> },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
