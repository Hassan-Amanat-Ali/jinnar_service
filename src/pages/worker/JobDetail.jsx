import { useParams } from "react-router-dom";
import Hero from "../../components/common/Hero";
import JobDetailComponent from "../../components/worker/JobDetail/JobDetailComponent";
import { useGetOrderByIdQuery } from "../../services/workerApi";
import { Loader2 } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();
  const { data: orderData, isLoading, error } = useGetOrderByIdQuery(id);
  
  // Extract order from API response
  const order = orderData;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error loading job</div>
          <div className="text-sm text-gray-500">
            {error?.data?.message || error?.message || "Job not found"}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Hero
        place="worker-detail"
        title={order.gigId?.title || "Job Request"}
        subtitle=""
        className="h-[7rem] sm:h-[8rem] md:h-[12rem] lg:h-[12rem]"
      />
      <JobDetailComponent order={order} />
    </div>
  );
};

export default JobDetail;
