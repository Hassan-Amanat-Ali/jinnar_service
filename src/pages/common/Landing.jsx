import { useEffect } from "react";
import Hero from "../../components/Landing/Hero.jsx";
import ServiceDiscovery from "../../components/Landing/ServiceDiscovery.jsx";
import GigSection from "../../components/Landing/GigSection.jsx";
import WorkerSection from "../../components/Landing/WorkerSection.jsx";
import FeaturedCourses from "../../components/Landing/FeaturedCourses.jsx";
import TrustSection from "../../components/Landing/TrustSection.jsx";
import CallToAction from "../../components/Landing/CallToAction.jsx";
import SiteFooter from "../../components/Landing/SiteFooter.jsx";
import HowItWorks from "../../components/Landing/HowItWorks.jsx";

const Landing = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <Hero />

      {/* 1. Popular Services */}
      <ServiceDiscovery />


      {/* 3. Top Rated Workers */}
      <WorkerSection
        title="Top Rated Professionals"
        subtitle="Connect with the best talent on Jinnar"
        queryOptions={{ sortBy: 'rating.average', sortOrder: 'desc' }}
        limit={4}
        viewAllUrl="/landing-workers"
        isLanding={true}
      />

      {/* 2. Trending Gigs */}
      <GigSection
        title="Trending Gigs"
        subtitle="Most popular services booked this week"
        queryOptions={{ sortBy: 'rating', minRating: 4 }}
        limit={8}
      />

      {/* 5. Courses */}
      <FeaturedCourses />


      {/* 6. Trust Stats */}
      <TrustSection />


      <HowItWorks />

      {/* 7. Call To Action */}
      <CallToAction />

      <SiteFooter showCTA={false} />
    </div>
  );
};

export default Landing;
