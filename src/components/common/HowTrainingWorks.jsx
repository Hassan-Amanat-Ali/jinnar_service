import React, { useState } from "react";
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
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  MessageSquare,
  Target,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Footer from "../Landing/SiteFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const HowTrainingWorks = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const trainingSteps = [
    {
      id: 1,
      title: "Learn Anytime, Anywhere",
      description:
        "Access short, interactive lessons, videos, and quizzes at your convenience.",
      detail:
        "Workers log in using their Jinnar accounts and learn at their own pace — no deadlines, no pressure.",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Pass Certification Tests",
      description: "Each course ends with quick, practical quizzes.",
      detail:
        "Once completed, you instantly receive a digital certificate and your Worker Excellence Badge.",
      icon: Award,
    },
    {
      id: 3,
      title: "Earn Trust & More Jobs",
      description: "Trained workers appear higher in customer searches.",
      detail:
        'The "Verified & Trained" tag boosts trust, visibility, and long-term job success.',
      icon: TrendingUp,
    },
  ];

  const courseCategories = [
    {
      title: "Professionalism & Communication",
      description:
        "Build confidence, clarity, and respect in every customer interaction.",
      icon: MessageSquare,
    },
    {
      title: "Time Management & Efficiency",
      description:
        "Master the habits that help you deliver faster and smarter.",
      icon: Clock,
    },
    {
      title: "Tool Preparedness & Safety",
      description:
        "Stay organized, clean, and ready for every job — safely and efficiently.",
      icon: Shield,
    },
    {
      title: "Business & Financial Literacy",
      description:
        "Learn how to manage your income, save, and grow your small business.",
      icon: DollarSign,
    },
    {
      title: "Leadership & Growth",
      description:
        "Advance your career from worker to supervisor or certified trainer.",
      icon: Target,
    },
  ];

  const workerBenefits = [
    "100% Free — no subscription, no hidden fees",
    "Learn at your own pace, from any phone or computer",
    "Gain verified credibility and higher visibility",
    "Improve customer trust and satisfaction",
    "Qualify for better, long-term jobs",
  ];

  const customerBenefits = [
    "Hire trained, reliable, and professional workers",
    "See verified badges before booking",
    "Enjoy consistent service quality and safety",
  ];

  const faqs = [
    {
      question: "Is Jinnar Training really free?",
      answer:
        "Yes! Every course is completely free for all Jinnar-registered workers.",
    },
    {
      question: "Can I learn in Swahili or English?",
      answer: "Yes, all modules are available in both Swahili and English.",
    },
    {
      question: "Do I need to complete courses at a set time?",
      answer:
        "No. Training is fully self-paced — start, pause, or continue whenever your schedule allows.",
    },
    {
      question: "What if I fail a quiz?",
      answer: "You can retake any quiz as many times as needed until you pass.",
    },
    {
      question: "Where can I see my badges?",
      answer:
        "Your badges appear automatically on your Jinnar profile once you complete each course.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How Training Works
            </h1>
            <p className="mt-3 text-lg text-white/90 font-medium">
              Empowering Every Worker to Rise, Learn, and Earn — Anytime, for
              Free.
            </p>
            <p className="mt-4 text-base sm:text-lg text-white/85">
              Your Journey to Professional Excellence Starts Here — On Your Own
              Time.
            </p>
            <p className="mt-3 text-sm text-white/80 max-w-3xl mx-auto">
              Through Training.Jinnar.com, workers gain verified skills, earn
              badges, and increase visibility to customers — all at their own
              pace, completely free of charge.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://training.jinnar.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Start My Free Training <ArrowRight size={16} />
              </a>
              <a href="#course-catalog" className="btn-outline">
                Explore Free Courses
              </a>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* 3-Step Training Journey */}
      <section className="section-container py-10">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-5xl mx-auto"
        >
          <Motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-semibold text-center mb-8"
          >
            The 3-Step Training Journey
          </Motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainingSteps.map((step, index) => (
              <Motion.div
                key={step.id}
                variants={fadeUp}
                className="text-center p-6 rounded-lg border border-border bg-white"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-4"
                  style={{ background: "var(--gradient-main)" }}
                >
                  <step.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{step.description}</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.detail}
                </p>
              </Motion.div>
            ))}
          </div>

          <Motion.p
            variants={fadeUp}
            className="text-center text-sm text-gray-600 mt-8 italic"
          >
            No fees. No schedules. Just real skills — learned your way.
          </Motion.p>
        </Motion.div>
      </section>

      {/* Course Categories */}
      <section id="course-catalog" className="bg-muted py-10">
        <div className="section-container">
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <Motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-semibold text-center mb-4"
            >
              What You Can Learn — For Free
            </Motion.h2>
            <Motion.p
              variants={fadeUp}
              className="text-center text-gray-700 mb-8 max-w-3xl mx-auto"
            >
              All Jinnar training programs are free and available 24/7. Choose
              the lessons that fit your career goals and learn whenever it's
              convenient for you.
            </Motion.p>

            <Motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courseCategories.map((category, index) => (
                <Motion.div
                  key={index}
                  variants={fadeUp}
                  className="p-6 rounded-lg border border-border bg-white hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4"
                    style={{ background: "var(--gradient-main)" }}
                  >
                    <category.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {category.description}
                  </p>
                </Motion.div>
              ))}
            </Motion.div>

            <Motion.div variants={fadeUp} className="text-center mt-8">
              <a
                href="https://training.jinnar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View Full Free Curriculum <ArrowRight size={16} />
              </a>
            </Motion.div>
          </Motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-container py-10">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-6xl mx-auto"
        >
          <Motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-semibold text-center mb-8"
          >
            Why Free Training Matters
          </Motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Motion.div variants={fadeUp}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users size={20} className="text-secondary" />
                For Workers
              </h3>
              <ul className="space-y-3">
                {workerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white mt-0.5 flex-shrink-0"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      <CheckCircle size={12} />
                    </span>
                    <span className="text-sm text-gray-800">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Motion.div>

            <Motion.div variants={fadeUp}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star size={20} className="text-secondary" />
                For Customers
              </h3>
              <ul className="space-y-3">
                {customerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white mt-0.5 flex-shrink-0"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      <CheckCircle size={12} />
                    </span>
                    <span className="text-sm text-gray-800">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Motion.div>
          </div>
        </Motion.div>
      </section>

      {/* Call-to-Action Section */}
      <section
        className="text-white py-10"
        style={{ background: "var(--gradient-cta-alt)" }}
      >
        <div className="section-container text-center">
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Ready to Start Your Free Journey?
            </h2>
            <p className="text-base text-white/90 mb-6">
              Join thousands of workers learning at their own pace and earning
              verified Jinnar badges.
            </p>
            <a
              href="https://training.jinnar.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Start Free Training Now <ArrowRight size={16} />
            </a>
          </Motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-container py-10">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <Motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-semibold text-center mb-8"
          >
            Common Questions
          </Motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Motion.div
                key={index}
                variants={fadeUp}
                className="border border-border rounded-lg bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HowTrainingWorks;
