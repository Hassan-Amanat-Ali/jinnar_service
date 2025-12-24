import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Charts from "../../components/worker/Home/Charts";
import Hero from "../../components/worker/Home/Hero";
import BookingCard from "../../components/customer/BookinCard";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery, useGetWalletQuery, useUpdateFcmTokenMutation } from "../../services/workerApi";
import { format } from "date-fns";
import { requestNotificationPermission } from "../../utils/fcm";
import {useAuth} from "../../context/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [updateFcmToken] = useUpdateFcmTokenMutation();
  const user = useAuth()

  // Fetch real bookings data
  const { data: ordersData, isLoading: ordersLoading } = useGetMyOrdersQuery();
  const { data: walletData } = useGetWalletQuery();

  // Request FCM permission and update token on component mount
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const token = await requestNotificationPermission();

        if (token) {
          // Send token to backend
          await updateFcmToken({ token }).unwrap();
          console.log("FCM token updated successfully");
        }
      } catch (error) {
        console.error("Error updating FCM token:", error);
      }
    };

    setupFCM();
  }, [updateFcmToken]);

  // Get recent orders (last 3)
  const recentOrders = ordersData?.slice(0, 3).filter((order)=>(order?.sellerId?._id === user?.user?._id)) || [];

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };



  return (
    <div>
      <Hero />

      {/* Charts with wallet data */}
      <Charts walletData={walletData} />

      {/* Your Bookings Section */}
      <div className="max-w-7xl mx-auto my-8 sm:my-12 lg:my-16 px-4 sm:px-6 lg:px-6 xl:px-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
              Your Bookings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Track ongoing and upcoming services
            </p>
          </div>
          <button
            className="border-2 text-[#74C7F2] border-[#74C7F2] rounded-lg py-1.5 px-2.5 sm:px-3 text-xs sm:text-sm cursor-pointer hover:bg-[#74C7F2] hover:text-white transition-all duration-300 whitespace-nowrap flex-shrink-0"
            onClick={() => navigate("/worker-bookings")}
          >
            View All
          </button>
        </div>

        {/* Loading State */}
        {ordersLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#74C7F2]" />
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
            {recentOrders.map((order) => (
              <BookingCard
                key={order._id}
                image={order.gigId?.images?.[0]?.url || null}
                title={order.gigId?.title || 'Service'}
                workerName={order.buyerId?.name || 'Customer'}
                time={formatDate(order.createdAt)}
                category={order.gigId?.category || 'Service'}
                status={order.status}
                price={order.price || order.gigId?.price || '0'}
                onClick={() => navigate(`/worker/booking/${order._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
            <p className="text-gray-500 text-sm">No bookings yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Your accepted job requests will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
