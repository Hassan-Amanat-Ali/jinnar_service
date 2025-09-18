import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  AlertTriangle,
  Bell,
  HelpCircle,
  FileText,
  TerminalSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// Import profile components
import ProfileOverview from "../../components/profile/ProfileOverview";
import ComplaintSubmission from "../../components/profile/ComplaintSubmission";
import Notifications from "../../components/profile/Notifications";
import HelpAndSupport from "../../components/profile/HelpAndSupport";
import PrivacyPolicy from "../../components/profile/PrivacyPolicy";
import TermsAndConditions from "../../components/profile/TermsAndConditions";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to render the active component
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileOverview />;
      case "complaint":
        return <ComplaintSubmission />;
      case "notifications":
        return <Notifications />;
      case "help":
        return <HelpAndSupport />;
      case "privacy":
        return <PrivacyPolicy />;
      case "terms":
        return <TermsAndConditions />;
      default:
        return <ProfileOverview />;
    }
  };

  const sidebarItems = [
    {
      id: "profile",
      label: "Profile Overview",
      icon: User,
      description: "View your personal details",
      active: true,
    },
    {
      id: "complaint",
      label: "Complaint Submission",
      icon: AlertTriangle,
      description: "Report issue or problems",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage Notifications preferences",
    },
    {
      id: "help",
      label: "Help and Support",
      icon: HelpCircle,
      description: "Get help and contact support",
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: FileText,
      description: "Read our privacy policy",
    },
    {
      id: "terms",
      label: "Terms and Conditions",
      icon: TerminalSquare,
      description: "Review terms and conditions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Menu size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Settings
                </h2>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={isActive ? "text-white" : "text-gray-500"}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {/* Logout */}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-red-600 hover:bg-red-50 border border-transparent mt-6">
                  <LogOut size={20} className="text-red-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-700">Logout</p>
                    <p className="text-xs text-red-500">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />

                {/* Mobile Sidebar */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    duration: 0.3,
                  }}
                  className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden shadow-2xl"
                >
                  <div className="p-6 h-full overflow-y-auto">
                    {/* Close Button */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          Settings
                        </h2>
                        <p className="text-sm text-gray-500">
                          Manage your account
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <nav className="space-y-2">
                      {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === activeTab;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200"
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon
                              size={20}
                              className={
                                isActive ? "text-blue-600" : "text-gray-500"
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  isActive ? "text-blue-900" : "text-gray-900"
                                }`}
                              >
                                {item.label}
                              </p>
                              <p
                                className={`text-xs ${
                                  isActive ? "text-blue-600" : "text-gray-500"
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}

                      {/* Logout */}
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-red-600 hover:bg-red-50 border border-transparent mt-6">
                        <LogOut size={20} className="text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-red-700">
                            Logout
                          </p>
                          <p className="text-xs text-red-500">
                            Sign out of your account
                          </p>
                        </div>
                      </button>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
