import JobCard from "../../components/customer/MyBookingsCard";
import serviceImg from "../../assets/images/home-repair.jpg";
import workerImg from "../../assets/images/worker.jpg";
import Hero from "../../components/common/Hero";

const CustomerBookings = () => {
  // Dummy data array
  const bookingsData = [
    {
      id: 1,
      serviceImage: serviceImg,
      serviceTitle: "Plumbing",
      serviceDescription: "Fix kitchen sink leak",
      emergencyTag: "Emergency",
      statusTag: "In Progress",
      workerImage: workerImg,
      workerName: "John Smith",
      workerRating: "4.8",
      date: "1/19/2025",
      time: "Morning",
      location: "123 Main St, Dar es Salaam",
      price: "150",
    },
    {
      id: 2,
      serviceImage: serviceImg,
      serviceTitle: "Electrical Work",
      serviceDescription: "Install ceiling fan in bedroom",
      emergencyTag: null,
      statusTag: "Pending",
      workerImage: workerImg,
      workerName: "Sarah Johnson",
      workerRating: "4.9",
      date: "1/20/2025",
      time: "Afternoon",
      location: "456 Oak Ave, Arusha",
      price: "200",
    },
    {
      id: 3,
      serviceImage: serviceImg,
      serviceTitle: "House Cleaning",
      serviceDescription: "Deep cleaning for 3-bedroom house",
      emergencyTag: null,
      statusTag: "Completed",
      workerImage: workerImg,
      workerName: "Michael Davis",
      workerRating: "4.7",
      date: "1/18/2025",
      time: "Morning",
      location: "789 Pine St, Mwanza",
      price: "120",
    },
    {
      id: 4,
      serviceImage: serviceImg,
      serviceTitle: "Carpentry",
      serviceDescription: "Repair wooden dining table",
      emergencyTag: null,
      statusTag: "In Progress",
      workerImage: workerImg,
      workerName: "Emma Wilson",
      workerRating: "4.6",
      date: "1/21/2025",
      time: "Evening",
      location: "321 Elm St, Dodoma",
      price: "180",
    },
    {
      id: 5,
      serviceImage: serviceImg,
      serviceTitle: "Pet Care",
      serviceDescription: "Dog grooming and nail trimming",
      emergencyTag: null,
      statusTag: "Pending",
      workerImage: workerImg,
      workerName: "David Brown",
      workerRating: "4.8",
      date: "1/22/2025",
      time: "Morning",
      location: "654 Maple Dr, Mbeya",
      price: "80",
    },
    {
      id: 6,
      serviceImage: serviceImg,
      serviceTitle: "Auto Repair",
      serviceDescription: "Change engine oil and filter",
      emergencyTag: "Urgent",
      statusTag: "Completed",
      workerImage: workerImg,
      workerName: "Lisa Anderson",
      workerRating: "4.5",
      date: "1/17/2025",
      time: "Afternoon",
      location: "987 Cedar Ln, Morogoro",
      price: "75",
    },
  ];

  return (
    <>
      <Hero
        place="My Bookings"
        title="My Bookings"
        subtitle="Track your current and past service requests"
        className="h-[16rem] md:h-[20rem] lg:h-[22rem]"
      />
      <div className="min-h-fit py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingsData.map((booking) => (
              <JobCard
                key={booking.id}
                serviceImage={booking.serviceImage}
                serviceTitle={booking.serviceTitle}
                serviceDescription={booking.serviceDescription}
                emergencyTag={booking.emergencyTag}
                statusTag={booking.statusTag}
                workerImage={booking.workerImage}
                workerName={booking.workerName}
                workerRating={booking.workerRating}
                date={booking.date}
                time={booking.time}
                location={booking.location}
                price={booking.price}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerBookings;
