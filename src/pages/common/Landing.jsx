import Hero from "../../components/Landing/Hero.jsx";
import HowItWorks from "../../components/Landing/HowItWorks.jsx";
import PopularServices from "../../components/Landing/PopularServices.jsx";
import TopWorkers from "../../components/Landing/TopWorkers.jsx";
import FeaturedCourses from "../../components/Landing/FeaturedCourses.jsx";
import Testimonials from "../../components/Landing/Testimonials.jsx";

import SiteFooter from "../../components/Landing/SiteFooter.jsx";

const Landing = () => {
  return (
    <div className="bg-white">
      <Hero />
      <HowItWorks />
      {/* <PopularServices /> */}
      <FeaturedCourses />
      <TopWorkers />
      {/* <Testimonials /> */}
      <SiteFooter />
    </div>
  );
};

export default Landing;
