import Hero from '../../components/Landing/Hero.jsx';
import HowItWorks from '../../components/Landing/HowItWorks.jsx';
import PopularServices from '../../components/Landing/PopularServices.jsx';
import TopWorkers from '../../components/Landing/TopWorkers.jsx';
import Testimonials from '../../components/Landing/Testimonials.jsx';
import CTA from '../../components/Landing/CTA.jsx';
import SiteFooter from '../../components/Landing/SiteFooter.jsx';

const Landing = () => {
  return (
    <div className='bg-white'>
      <Hero />
      <HowItWorks />
      <PopularServices />
      <TopWorkers />
      <Testimonials />
      <CTA />
      <SiteFooter />
    </div>
  );
};

export default Landing;
