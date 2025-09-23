import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import LandingLayout from "../layouts/LandingLayout.jsx";
import WorkerLayout from "../layouts/WorkerLayout.jsx";
import SetupLayout from "../layouts/SetupLayout.jsx";
import Landing from "../pages/common/Landing.jsx";
import RoleSelection from "../pages/common/RoleSelection.jsx";
import Login from "../pages/common/Login.jsx";
import Signup from "../pages/common/Signup.jsx";
import Help from "../pages/common/Help.jsx";
import PrivacyPolicy from "../pages/common/PrivacyPolicy.jsx";
import Notifications from "../pages/common/Notifications.jsx";
import Chat from "../pages/common/Chat.jsx";
import Profile from "../pages/common/Profile.jsx";
import Complaint from "../pages/common/Complaint.jsx";
import CustomerHome from "../pages/customer/Home.jsx";
import AllServices from "../pages/customer/AllServices.jsx";
import CustomerBookings from "../pages/customer/MyBookings.jsx";
import BookWorker from "../pages/customer/BookWorker.jsx";
import BookingConfirm from "../pages/customer/BookingConfirm.jsx";
import CustomerBookingDetail from "../pages/customer/BookingDetail.jsx";
import WorkerPublicProfile from "../pages/customer/WorkerProfile.jsx";
import WorkerHome from "../pages/worker/Home.jsx";
import ProfileSetupBasic from "../pages/worker/ProfileSetupBasic.jsx";
import ProfileSetupServices from "../pages/worker/ProfileSetupServices.jsx";
import ProfileSetupPricing from "../pages/worker/ProfileSetupPricing.jsx";
import ProfileSetupAvailability from "../pages/worker/ProfileSetupAvailability.jsx";
import ProfileSetupExperience from "../pages/worker/ProfileSetupExperience.jsx";
import Jobs from "../pages/worker/Jobs.jsx";
import JobDetail from "../pages/worker/JobDetail.jsx";
import WorkerBookings from "../pages/worker/MyBookings.jsx";
import WorkerBookingDetail from "../pages/worker/BookingDetail.jsx";
import Wallet from "../pages/worker/Wallet.jsx";
import CustomerProfile from "../pages/worker/CustomerProfile.jsx";
import PaymentMethods from "../pages/worker/PaymentMethods.jsx";
import CategoryService from "../pages/customer/CategoryService.jsx";

const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  {
    element: <MainLayout />,
    children: [
      // Common pages
      { path: "role", element: <RoleSelection /> },

      { path: "help", element: <Help /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "notifications", element: <Notifications /> },
      { path: "chat", element: <Chat /> },
      { path: "profile", element: <Profile /> },
      { path: "complaint", element: <Complaint /> },

      // Customer pages - simple flat routing
      { path: "customer-home", element: <CustomerHome /> },
      { path: "services", element: <AllServices /> },
      { path: "services/:slug", element: <CategoryService /> },

      { path: "customer-bookings", element: <CustomerBookings /> },
      { path: "book-worker/:slug", element: <BookWorker /> },
      { path: "booking-confirm", element: <BookingConfirm /> },
      { path: "customer-booking/:slug", element: <CustomerBookingDetail /> },
      { path: "worker-profile/:slug", element: <WorkerPublicProfile /> },
    ],
  },
  {
    element: <SetupLayout />,
    children: [
      // Worker setup pages - without navbar/footer
      { path: "worker-setup-basic", element: <ProfileSetupBasic /> },
      { path: "worker-setup-services", element: <ProfileSetupServices /> },
      { path: "worker-setup-experience", element: <ProfileSetupExperience /> },
      { path: "worker-setup-pricing", element: <ProfileSetupPricing /> },
      {
        path: "worker-setup-availability",
        element: <ProfileSetupAvailability />,
      },
    ],
  },
  {
    element: <WorkerLayout />,
    children: [
      // Worker pages - using dedicated WorkerLayout
      { path: "worker-home", element: <WorkerHome /> },
      { path: "jobs", element: <Jobs /> },
      { path: "job/:id", element: <JobDetail /> },
      { path: "worker-bookings", element: <WorkerBookings /> },
      { path: "worker-booking/:id", element: <WorkerBookingDetail /> },
      { path: "wallet", element: <Wallet /> },
      { path: "customer-profile/:id", element: <CustomerProfile /> },
      { path: "payment-methods", element: <PaymentMethods /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
