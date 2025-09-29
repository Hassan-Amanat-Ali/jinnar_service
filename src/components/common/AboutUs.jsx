import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Scale,
  Lightbulb,
  Heart,
  CheckCircle,
  Smartphone,
  MessageSquare,
  CreditCard,
  Award,
  Search,
  PenTool,
  GraduationCap,
  Handshake,
} from "lucide-react";
import heroImage from "../../assets/images/growing.jpg";
import workerImage from "../../assets/images/worker.jpg";

const AboutUs = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const values = [
    {
      icon: Shield,
      title: "Trustworthiness",
      description:
        "We protect every transaction and interaction with honesty and transparency. Trust is our currency.",
    },
    {
      icon: Zap,
      title: "Hard Work & Hustle",
      description:
        "We believe in honoring the everyday hustle. Every worker on Jinnar is here to grow, to serve, and to succeed.",
    },
    {
      icon: Scale,
      title: "Fairness & Equality",
      description:
        "No matter your location, language, or background—everyone deserves fair exposure, fair pay, and fair treatment.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We use technology to make life easier for informal workers and the customers who rely on them. Simple tools. Big results.",
    },
    {
      icon: Heart,
      title: "Mutual Respect",
      description:
        "Respect isn't optional. It's the foundation of every job booked and every badge earned.",
    },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Workers",
      description:
        "Every worker undergoes basic checks and is reviewed by real customers.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Access",
      description:
        "Designed for all phones and networks, from Dar es Salaam to Dodoma to remote villages.",
    },
    {
      icon: MessageSquare,
      title: "Built-in Chat & Booking",
      description:
        "No confusion. Communicate directly and track every job inside the platform.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Mobile money–powered. Pay only when work is complete.",
    },
    {
      icon: Award,
      title: "Earn Badges & Trust",
      description:
        "Workers can take free training to earn badges and grow their visibility.",
    },
  ];

  const ctaButtons = [
    {
      icon: Search,
      title: "Find a Worker",
      to: "/services",
    },
    {
      icon: PenTool,
      title: "Post a Job",
      to: "/customer-home",
    },
    {
      icon: GraduationCap,
      title: "Explore Free Training",
      to: "/training",
    },
    {
      icon: Handshake,
      title: "Partner With Us",
      to: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative text-white"
        aria-label="About Jinnar overview"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div className="section-container py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
              >
                About <span className="text-secondary">Jinnar</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.05, duration: 0.5 }}
                className="mt-3 text-base sm:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0"
              >
                Trusted Workers, Real Jobs.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-2 text-sm sm:text-base text-white/85 max-w-3xl mx-auto lg:mx-0"
              >
                Welcome to Jinnar, the digital home of Tanzania's most
                hardworking hands and trusted local talent. From plumbers to
                tailors to mechanics, Jinnar connects you directly to skilled
                informal workers—safely, fairly, and instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/services"
                    className="btn-primary"
                    aria-label="Find a worker"
                  >
                    <Search /> Find a Worker
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/customer-home"
                    className="btn-outline"
                    aria-label="Post a job"
                  >
                    <PenTool /> Post a Job
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <motion.div
              className="relative hidden xl:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-white/15">
                <img
                  src={heroImage}
                  alt="Workers collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section-container py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
          Our Purpose
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Vision */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: "var(--gradient-main)" }}
              >
                <Lightbulb className="text-white" size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Our Vision
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              To unlock the full potential of informal workers by building the
              most trusted, accessible, and empowering platform for dignified
              work and economic growth across Africa.
            </p>
            <p className="text-gray-700 leading-relaxed text-base mt-3 font-medium">
              We see a future where informal workers are not left behind—but are
              celebrated, empowered, and connected to opportunity.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: "var(--gradient-main)" }}
              >
                <Heart className="text-white" size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Our Mission
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              Jinnar connects everyday workers with real job
              opportunities—safely, fairly, and transparently—using digital
              tools to build trust, improve skills, and raise incomes for
              families and communities.
            </p>
            <p className="text-gray-700 leading-relaxed text-base mt-3 font-medium">
              We're building more than just a marketplace—we're creating a
              movement that uplifts millions through honest work.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-12">
        <div className="section-container">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
            What We Stand For
          </h2>
          <p className="text-center text-base text-gray-600 max-w-3xl mx-auto mb-8">
            Our platform is shaped by five powerful cultural values
          </p>

          <motion.ul
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {values.map((value, index) => (
              <motion.li
                key={index}
                variants={fadeUp}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted"
              >
                <span
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ background: "var(--gradient-main)" }}
                  aria-hidden
                >
                  <value.icon className="text-white" size={14} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm mt-0.5">
                    {value.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Why Jinnar Section */}
      <section className="bg-muted py-12">
        <div className="section-container">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
            Why Jinnar?
          </h2>

          <motion.ul
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((feature, index) => (
              <motion.li
                key={index}
                variants={fadeUp}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-white"
              >
                <span
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ background: "var(--gradient-main)" }}
                  aria-hidden
                >
                  <feature.icon className="text-white" size={14} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Who Is Jinnar For Section */}
      <section className="bg-white py-12">
        <div className="section-container">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
            Who Is Jinnar For?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="rounded-xl p-6 border border-border bg-muted">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                For Customers
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Tired of being let down? Post a job or find a trusted worker in
                minutes. No guesswork. No scams.
              </p>
            </div>

            {/* For Workers */}
            <div className="rounded-xl p-6 border border-border bg-muted">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                For Workers
              </h3>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Whether you're a plumber, painter, or welder—you can grow your
                reputation, land more jobs, and get paid fairly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        className="text-white"
        style={{ background: "var(--gradient-cta-alt)" }}
      >
        <div className="section-container py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Jinnar: Where Hard Work Meets Opportunity
              </h2>
              <p className="text-base sm:text-lg text-white/90 max-w-3xl">
                We're more than an app—We're a digital bridge between talent and
                trust.
              </p>
            </div>
            <div className="hidden xl:block">
              <img
                src={workerImage}
                alt="Skilled worker on a job"
                className="rounded-xl shadow-xl ring-1 ring-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Born in Tanzania Section */}
      <section className="bg-muted py-12">
        <div className="section-container text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-3">
            Born in Tanzania, Built for Africa
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            Jinnar started with one goal: to help informal workers thrive in the
            digital age. From Kariakoo to Kibaha, Ikungi to Mtwara, Kigoma to
            Kilimanjaro—we believe that great work deserves recognition, and
            every skilled hand deserves opportunity.
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">
            Join us. Let's build a better future—one job at a time.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12">
        <div className="section-container">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
            Ready to Start?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ctaButtons.map((button, index) => (
              <Link
                key={index}
                to={button.to}
                className="rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 border border-border"
                style={{ background: "var(--gradient-main)", color: "#000" }}
                aria-label={button.title}
              >
                <button.icon className="mx-auto mb-2" size={24} />
                <h3 className="text-base font-semibold">{button.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
