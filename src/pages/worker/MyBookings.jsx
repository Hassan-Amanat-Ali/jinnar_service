import Hero from "../../components/common/Hero";
import PlumbingRepair from "../../components/worker/MyBookings/PlumbingRepair";

const WorkerBookings = () => {
  return (
    <div>
      <Hero
        place="My Bookings"
        title="My Bookings"
        subtitle=""
        className="lg:h-[22rem] h-[12rem] md:h-[18rem]"
      />
      <div className="px-6 mx-auto">
        <PlumbingRepair />
      </div>
    </div>
  );
};

export default WorkerBookings;
