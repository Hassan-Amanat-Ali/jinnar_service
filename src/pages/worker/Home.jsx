import Charts from "../../components/worker/Home/Charts";
import Hero from "../../components/worker/Home/Hero";
import LatestJobs from "../../components/worker/Home/LatesJobs";
import service1 from "../../assets/images/All-services-1.jpg";
import service2 from "../../assets/images/all-services-2.jpg";
import service3 from "../../assets/images/all-services-3.jpg";
import BookingCard from "../../components/customer/BookinCard";
import Testimonials from "../../components/Landing/Testimonials";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Hero />
      <LatestJobs />
      <Charts />
      <div className="max-w-7xl mx-auto my-20 px-4 sm:px-6 lg:px-6 xl:px-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Your Bookings
            </h1>
            <p className="text-sm sm:text-base">
              Track your ongoing and upcoming services
            </p>
          </div>
          <button
            className="border-2 text-[#74C7F2] border-[#74C7F2] rounded-md py-1.5 px-3 text-sm cursor-pointer hover:bg-[#74C7F2] hover:text-white transition-all duration-300 w-fit"
            onClick={() => navigate("/jobs")}
          >
            View All Bookings
          </button>
        </div>
        <div className="flex flex-col gap-6 mt-6">
          <BookingCard
            image={service1}
            title="Web Design"
            workerName="John Doe"
            time="2 hours ago"
            category="Design"
            status="Confirmed"
            price="50"
          />
          <BookingCard
            image={service2}
            title="Web Design"
            workerName="John Doe"
            time="2 hours ago"
            category="Design"
            status="Confirmed"
            price="50"
          />
          <BookingCard
            image={service3}
            title="Web Design"
            workerName="John Doe"
            time="2 hours ago"
            category="Design"
            status="Confirmed"
            price="50"
          />
        </div>
      </div>
      <Testimonials />
    </div>
  );
};
export default Home;
