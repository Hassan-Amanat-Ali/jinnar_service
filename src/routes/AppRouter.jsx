import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import LandingLayout from "../layouts/LandingLayout.jsx";
import WorkerLayout from "../layouts/WorkerLayout.jsx";
import SetupLayout from "../layouts/SetupLayout.jsx";
import FooterOnlyLayout from "../layouts/FooterOnlyLayout.jsx";
import Landing from "../pages/common/Landing.jsx";
import RoleSelection from "../pages/common/RoleSelection.jsx";
import Login from "../pages/common/Login.jsx";
import Signup from "../pages/common/Signup.jsx";
import Verify from "../pages/common/Verify.jsx";
import ForgotPassword from "../pages/common/ForgotPassword.jsx";
import ResetPassword from "../pages/common/ResetPassword.jsx";
import Help from "../pages/common/Help.jsx";
import Contact from "../pages/common/Contact.jsx";
import Notifications from "../pages/common/Notifications.jsx";
import Chat from "../pages/customer/Chat.jsx";
import Chat1 from "../pages/worker/Chat.jsx";
import Profile from "../pages/common/Profile.jsx";
import Complaint from "../pages/common/Complaint.jsx";
import CustomerHome from "../pages/customer/Home.jsx";
import AllServices from "../pages/customer/AllServices.jsx";
import CustomerBookings from "../pages/customer/MyBookings.jsx";
import BookWorker from "../pages/customer/BookWorker.jsx";
import BookingConfirm from "../pages/customer/BookingConfirm.jsx";
import CustomerBookingDetail from "../pages/customer/BookingDetail.jsx";
import CustomerWallet from "../pages/customer/Wallet.jsx";
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
import AboutUs from "../components/common/AboutUs.jsx";
import Jinnar from "../components/common/Jinnar.jsx";
import JinnarDetailed from "../components/common/JinnarDetailed.jsx";
import HowTrainingWorks from "../components/common/HowTrainingWorks.jsx";
import { ROLES } from "../constants/roles.js";
import RoleGuard from "../components/common/RoleGuard.jsx";
import PrivacyPolicies from "../pages/common/PrivacyPolicy.jsx";
import AllServicesLanding from "../pages/landing/Landing.jsx";
import SupportTicketDetail from "../components/profile/SupportTicketDetail.jsx";
import AccountVerification from "../components/profile/AccountVerification.jsx";
import Terms from "../pages/common/Terms.jsx";

const router = createBrowserRouter([
  // Public landing pages - accessible to everyone
  {
    element: <LandingLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "landing-services", element: <AllServicesLanding /> },
      { path: "what-is-jinnar", element: <Jinnar /> },
      { path: "what-is-jinnar/detailed", element: <JinnarDetailed /> },
      { path: "how-training-works", element: <HowTrainingWorks /> },
      { path: "help", element: <Help /> },
      { path: "privacy-policy", element: <PrivacyPolicies /> },
      { path: "terms-condition", element: <Terms /> },
      { path: "about-us", element: <AboutUs /> },
    ],
  },
  // Public auth pages - no layout
  { path: "role", element: <RoleSelection /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "verify", element: <Verify /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password", element: <ResetPassword /> },
  {
    element: <MainLayout />,
    children: [
      // Common pages
      { path: "contact", element: <Contact /> },
      // { path: "chat", element: <Chat /> },
      { path: "privacy", element: <PrivacyPolicies /> },
      { path: "notifications", element: <Notifications /> },
      { path: "profile", element: <Profile /> },
      { path: "complaint", element: <Complaint /> },
      { path: "profile/support-ticket/:id", element: <SupportTicketDetail /> },

      // Customer pages - simple flat routing (accessible to customers AND workers)
      {
        path: "customer-home",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <CustomerHome />
          </RoleGuard>
        ),
      },
      {
        path: "customer-chat",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <Chat />
          </RoleGuard>
        ),
      },
      {
        path: "services",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <AllServices />
          </RoleGuard>
        ),
      },
      {
        path: "services/:slug",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <CategoryService />
          </RoleGuard>
        ),
      },

      {
        path: "customer-bookings",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <CustomerBookings />
          </RoleGuard>
        ),
      },
      {
        path: "book-worker/:sellerId/:gigId",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <BookWorker />
          </RoleGuard>
        ),
      },
      {
        path: "booking-confirm",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <BookingConfirm />
          </RoleGuard>
        ),
      },
      {
        path: "customer-booking/:slug",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <CustomerBookingDetail />
          </RoleGuard>
        ),
      },
      {
        path: "customer-wallet",
        element: (
          <RoleGuard allow={[ROLES.CUSTOMER, ROLES.WORKER]}>
            <CustomerWallet />
          </RoleGuard>
        ),
      },
      // { path: "worker-profile/:slug", element: <WorkerPublicProfile /> },
    ],
  },
  {
    element: (
      <RoleGuard allow={ROLES.WORKER}>
        <SetupLayout />
      </RoleGuard>
    ),
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
    element: (
      <RoleGuard allow={ROLES.WORKER}>
        <WorkerLayout />
      </RoleGuard>
    ),
    children: [
      // Worker pages - using dedicated WorkerLayout
      { path: "worker-home", element: <WorkerHome /> },
      { path: "jobs", element: <Jobs /> },
      { path: "job/:id", element: <JobDetail /> },
      { path: "worker-bookings", element: <WorkerBookings /> },
      { path: "worker/booking/:id", element: <WorkerBookingDetail /> },
      { path: "wallet", element: <Wallet /> },
      { path: "payment-methods", element: <PaymentMethods /> },
      { path: "worker/profile", element: <Profile /> },
      { path: "worker-chat", element: <Chat1 /> },

      { path: "worker/profile/verification", element: <AccountVerification /> },
    ],
  },
  {
    element: <FooterOnlyLayout />,
    children: [
      // Profile pages - footer only, no navbar
      { path: "worker-profile/:id", element: <WorkerPublicProfile /> },
      { path: "customer-profile/:id", element: <CustomerProfile /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
