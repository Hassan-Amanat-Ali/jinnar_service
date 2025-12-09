import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Wallet,
  Users,
  Zap,
} from "lucide-react";
import Footer from "../Landing/SiteFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const Jinnar = () => {
  const customerSteps = [
    "Search/choose a worker.",
    "Send a job request (with details).",
    "Approve and pay inside Jinnar.",
    "Rate and review after job completion.",
  ];

  const workerSteps = [
    "Receive a job request.",
    "Accept and confirm details with customer.",
    "Complete the job and mark it done.",
    "Receive payment in wallet → withdraw if needed.",
  ];

  const customerBenefits = [
    {
      icon: Users,
      text: "Smart Matching – AI suggests the best workers by skill, location, ratings, availability.",
    },
    {
      icon: Shield,
      text: "Trusted Workers – Verified profiles and reviews for confidence.",
    },
    {
      icon: ArrowRight,
      text: "Faster Hiring – Intelligent recommendations for quick booking.",
    },
    {
      icon: Wallet,
      text: "Secure Payments – Jinnar Wallet releases funds when job is completed.",
    },
    {
      icon: Star,
      text: "Quality Assurance – Ratings and AI filters keep standards high.",
    },
  ];

  const workerBenefits = [
    {
      icon: ArrowRight,
      text: "More Job Opportunities – AI shows your profile to the right customers.",
    },
    {
      icon: Star,
      text: "Boosted Visibility – Fair promotion for new and experienced workers.",
    },
    {
      icon: CheckCircle,
      text: "Skill Growth – Free training with AI-suggested areas to improve.",
    },
    {
      icon: Users,
      text: "Fair Exposure – Balanced, unbiased discovery across workers.",
    },
    {
      icon: Zap,
      text: "Faster Job Matches – Connect quickly with nearby customers.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero/Intro */}
      <section
        className="text-white pt-16 sm:pt-20 lg:pt-24"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div className="section-container py-12 sm:py-16 lg:py-20 px-4">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              What Is <span className="text-[#B6E0FE]">Jinnar</span>?
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl text-white/95 font-medium">
              Empowering the Informal Sector in Africa
            </p>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Jinnar is a digital marketplace built to connect skilled informal
              sector workers with people and businesses that need their
              services.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/landing-services" className="btn-primary w-full sm:w-auto text-sm sm:text-base">
                Hire a Worker <ArrowRight size={16} className="inline-block ml-1" />
              </Link>
              <Link to="/worker-home" className="btn-outline w-full sm:w-auto text-sm sm:text-base">
                Offer Your Services
              </Link>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-container py-12 sm:py-16 lg:py-20 px-4">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center"
        >
          <Motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900"
          >
            Our Mission
          </Motion.h2>
          <Motion.p
            variants={fadeUp}
            className="mt-4 sm:mt-6 text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed"
          >
            Give trusted workers more opportunities and give customers an easier
            way to find them. From plumbers in Dar es Salaam to tailors in
            Nairobi, Jinnar helps you hire smarter, work better, and grow
            together.
          </Motion.p>
        </Motion.div>
      </section>

      {/* Why We Exist */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="section-container px-4">
          <div className="max-w-5xl mx-auto">
            <Motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900"
            >
              Why We Exist
            </Motion.h3>
            <Motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-700 text-base sm:text-lg mt-4 sm:mt-5 text-center max-w-3xl mx-auto leading-relaxed"
            >
              In Africa, millions of skilled workers operate in the informal
              sector—without online visibility or easy access to customers.
              Customers struggle to find reliable, verified providers.
            </Motion.p>

            <Motion.ul
              role="list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              {[
                "Giving workers a platform to showcase skills, earn trust, and get more jobs.",
                "Helping customers hire faster, safer, and with confidence.",
              ].map((text, i) => (
                <Motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 rounded-xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#74C7F2] transition-all duration-300"
                >
                  <span
                    className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-md"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                  </span>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed flex-1">
                    {text}
                  </p>
                </Motion.li>
              ))}
            </Motion.ul>
          </div>
        </div>
      </section>

      {/* How It Works (compact two columns) */}
      <section className="section-container py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
          >
            How It Works
          </Motion.h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Customer Side (Finding Help)
              </h3>
              <Motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="space-y-3 sm:space-y-4"
              >
                {customerSteps.map((step, idx) => (
                  <Motion.li
                    key={idx}
                    variants={fadeUp}
                    className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-gray-800 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 transition-colors duration-200"
                  >
                    <span
                      className="shrink-0 mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-md"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{step}</span>
                  </Motion.li>
                ))}
              </Motion.ol>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Worker Side (Getting Jobs)
              </h3>
              <Motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="space-y-3 sm:space-y-4"
              >
                {workerSteps.map((step, idx) => (
                  <Motion.li
                    key={idx}
                    variants={fadeUp}
                    className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-gray-800 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg hover:from-green-100 transition-colors duration-200"
                  >
                    <span
                      className="shrink-0 mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-md"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{step}</span>
                  </Motion.li>
                ))}
              </Motion.ol>
            </Motion.div>
          </div>
        </div>

      </section>

      {/* Detailed Breakdown CTA */}
      <section
        className="text-white"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div className="section-container py-10 sm:py-12 lg:py-14 px-4">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Want to Know More?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Dive deeper into how Jinnar works with our complete step-by-step breakdown
            </p>
            <Link
              to="/what-is-jinnar/detailed"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base"
            >
              View Detailed Breakdown
              <ArrowRight size={18} />
            </Link>
          </Motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="section-container px-4">
          <Motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
          >
            Platform Benefits
          </Motion.h3>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Users size={20} />
                </span>
                Benefits for Customers
              </h3>
              <Motion.ul
                role="list"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="space-y-3 sm:space-y-4"
              >
                {customerBenefits.map((item, i) => (
                  <Motion.li
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <span
                      className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      <item.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </span>
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed flex-1">
                      {item.text}
                    </p>
                  </Motion.li>
                ))}
              </Motion.ul>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-md">
                  <Zap size={20} />
                </span>
                Benefits for Workers
              </h3>
              <Motion.ul
                role="list"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="space-y-3 sm:space-y-4"
              >
                {workerBenefits.map((item, i) => (
                  <Motion.li
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <span
                      className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      <item.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </span>
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed flex-1">
                      {item.text}
                    </p>
                  </Motion.li>
                ))}
              </Motion.ul>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Join the Movement CTA */}
      <section
        className="text-white mb-8 sm:mb-12"
        style={{ background: "var(--gradient-cta-alt)" }}
      >
        <div className="section-container py-8 sm:py-10 lg:py-12 px-4">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5">
            Join the Movement
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            Jinnar is more than a platform—it's a movement to give dignity,
            opportunity, and growth to hardworking people across the region.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/services" className="btn-primary w-full sm:w-auto text-sm sm:text-base">
              Get Started <ArrowRight size={16} className="inline-block ml-1" />
            </Link>
            <Link to="/signup" className="btn-outline w-full sm:w-auto text-sm sm:text-base">
              Sign Up Now
            </Link>
            <Link to="/contact" className="btn-outline w-full sm:w-auto text-sm sm:text-base">
              Contact Us
            </Link>
          </div>
          </Motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Jinnar;
