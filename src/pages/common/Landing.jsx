import Hero from "../../components/Landing/Hero.jsx";
import HowItWorks from "../../components/Landing/HowItWorks.jsx";
import TopWorkers from "../../components/Landing/TopWorkers.jsx";
import FeaturedCourses from "../../components/Landing/FeaturedCourses.jsx";
import SiteFooter from "../../components/Landing/SiteFooter.jsx";

const Landing = () => {
  return (
    <div className="bg-white">
      <Hero />
      <TopWorkers isLanding={true} />
      <HowItWorks />
      <FeaturedCourses />
      <SiteFooter />
    </div>
  );
};

export default Landing;
