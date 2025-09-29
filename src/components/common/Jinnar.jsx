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
    <div className="min-h-screen bg-white">
      {/* Hero/Intro */}
      <section
        className="text-white pt-20"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div className="section-container py-10 sm:py-12">
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              What Is <span className="text-secondary">Jinnar</span>?
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/90">
              Empowering the Informal Sector in Africa
            </p>
            <p className="mt-3 text-sm sm:text-base text-white/85">
              Jinnar is a digital marketplace built to connect skilled informal
              sector workers with people and businesses that need their
              services.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link to="/services" className="btn-primary">
                Hire a Worker <ArrowRight size={16} />
              </Link>
              <Link to="/worker-home" className="btn-outline">
                Offer Your Services
              </Link>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-container py-10">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <Motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-semibold"
          >
            Our Mission
          </Motion.h2>
          <Motion.p variants={fadeUp} className="mt-3 text-gray-700 text-base">
            Give trusted workers more opportunities and give customers an easier
            way to find them. From plumbers in Dar es Salaam to tailors in
            Nairobi, Jinnar helps you hire smarter, work better, and grow
            together.
          </Motion.p>
        </Motion.div>
      </section>

      {/* Why We Exist */}
      <section className="bg-muted py-10">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-semibold text-center">
              Why We Exist
            </h3>
            <p className="text-gray-700 text-base mt-3 text-center">
              In Africa, millions of skilled workers operate in the informal
              sector—without online visibility or easy access to customers.
              Customers struggle to find reliable, verified providers.
            </p>

            <Motion.ul
              role="list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                "Giving workers a platform to showcase skills, earn trust, and get more jobs.",
                "Helping customers hire faster, safer, and with confidence.",
              ].map((text, i) => (
                <Motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-white"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    <CheckCircle size={14} />
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {text}
                  </p>
                </Motion.li>
              ))}
            </Motion.ul>
          </div>
        </div>
      </section>

      {/* How It Works (compact two columns) */}
      <section className="section-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold">
              Customer Side (Finding Help)
            </h3>
            <Motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-3 space-y-2"
            >
              {customerSteps.map((step, idx) => (
                <Motion.li
                  key={idx}
                  variants={fadeUp}
                  className="flex items-start gap-2 text-sm text-gray-800"
                >
                  <span
                    className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-black"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </Motion.li>
              ))}
            </Motion.ol>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold">
              Worker Side (Getting Jobs)
            </h3>
            <Motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-3 space-y-2"
            >
              {workerSteps.map((step, idx) => (
                <Motion.li
                  key={idx}
                  variants={fadeUp}
                  className="flex items-start gap-2 text-sm text-gray-800"
                >
                  <span
                    className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-black"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </Motion.li>
              ))}
            </Motion.ol>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Detailed Step-by-Step Breakdown is available on a dedicated page for
          in-depth readers.
        </p>
      </section>

      {/* Benefits */}
      <section className="bg-white py-10">
        <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold">Benefits for Customers</h3>
            <Motion.ul
              role="list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-3 space-y-3"
            >
              {customerBenefits.map((item, i) => (
                <Motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    <item.icon size={14} />
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {item.text}
                  </p>
                </Motion.li>
              ))}
            </Motion.ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Benefits for Workers</h3>
            <Motion.ul
              role="list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-3 space-y-3"
            >
              {workerBenefits.map((item, i) => (
                <Motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    <item.icon size={14} />
                  </span>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {item.text}
                  </p>
                </Motion.li>
              ))}
            </Motion.ul>
          </div>
        </div>
      </section>

      {/* Join the Movement CTA */}
      <section
        className="text-white mb-15"
        style={{ background: "var(--gradient-cta-alt)" }}
      >
        <div className="section-container py-10 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold">
            Join the Movement
          </h3>
          <p className="mt-2 text-base text-white/90 max-w-2xl mx-auto">
            Jinnar is more than a platform—it’s a movement to give dignity,
            opportunity, and growth to hardworking people across the region.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link to="/services" className="btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/signup" className="btn-outline">
              Sign Up Now
            </Link>
            <Link to="/about-us" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Jinnar;
