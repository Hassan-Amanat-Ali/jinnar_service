import Hero from "../../components/common/Hero";
import JobsSection from "../../components/worker/Jobs/JobsSection";

const Jobs = () => {
  return (
    <div>
      <Hero
        place="job-worker"
        title="Jobs"
        subtitle="Track your current and past service requests"
        className="h-[20rem] md:h-[15rem] lg:h-[20rem]"
      />
      <JobsSection />
    </div>
  );
};

export default Jobs;
