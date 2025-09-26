import Hero from "../../components/common/Hero";
import JobDetailComponent from "../../components/worker/JobDetail/JobDetailComponent";

const JobDetail = () => {
  return (
    <div>
      <Hero
        place="worker-detail"
        title="Plumbing Request"
        subtitle=""
        className="h-[7rem] sm:h-[8rem] md:h-[12rem] lg:h-[12rem]"
      />
      <JobDetailComponent />
    </div>
  );
};

export default JobDetail;
