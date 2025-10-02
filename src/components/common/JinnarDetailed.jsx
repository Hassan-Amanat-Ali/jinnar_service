import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const steps = [
  {
    id: "step-1",
    title: "Step 1: Customer Finds a Worker",
    points: [
      "Customers open the Jinnar app.",
      "They search by skill (e.g., welding, hairdressing, cleaning).",
      "They view profiles: photo, skill, ratings, price.",
      "They choose a worker and send a request.",
    ],
  },
  {
    id: "step-2",
    title: "Step 2: Worker Gets the Request",
    points: [
      "Worker gets a notification alert on their phone.",
      "The job shows time, location, and details.",
      "Worker can accept or reject the request.",
    ],
  },
  {
    id: "step-3",
    title: "Step 3: Chat & Confirm",
    points: [
      "If worker accepts, both sides can chat safely inside the app.",
      "They confirm small details (time, tools, directions).",
      "All chats stay saved for safety and proof.",
    ],
  },
  {
    id: "step-4",
    title: "Step 4: Job is Done",
    points: [
      "Worker goes to location and completes the job.",
      "When done, worker marks “Job Complete” inside Jinnar.",
    ],
  },
  {
    id: "step-5",
    title: "Step 5: Payment Release",
    points: [
      "Customer confirms job was finished.",
      "Money moves from customer → Jinnar wallet → worker’s wallet.",
      "Worker can withdraw to bank, mobile money, or cash-out point.",
    ],
  },
  {
    id: "step-6",
    title: "Step 6: Rating & Review",
    points: [
      "Customer leaves a rating (1–5 stars).",
      "Review affects worker’s profile ranking.",
      "Better Ratings = More Jobs.",
    ],
  },
];

const JinnarDetailed = () => {
  return (
    <div className="min-h-screen bg-white">
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
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Detailed Step-by-Step Breakdown
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/85">
              A deeper look at how Jinnar works for customers and workers.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link to="/what-is-jinnar" className="btn-outline">
                Back to Overview
              </Link>
              <Link to="/services" className="btn-primary">
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="section-container py-10">
        <div className="max-w-5xl mx-auto">
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <Motion.h2
              variants={fadeUp}
              className="text-xl sm:text-2xl font-semibold text-center"
            >
              Quick Navigation
            </Motion.h2>
            <Motion.ul
              role="list"
              variants={stagger}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {steps.map((s) => (
                <Motion.li key={s.id} variants={fadeUp} className="">
                  <a
                    href={`#${s.id}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border bg-white hover:bg-gray-50 text-sm"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ background: "var(--gradient-main)" }}
                    >
                      <CheckCircle size={14} />
                    </span>
                    <span>{s.title}</span>
                  </a>
                </Motion.li>
              ))}
            </Motion.ul>
          </Motion.div>

          <div className="mt-10 space-y-8">
            {steps.map((s, idx) => (
              <section id={s.id} key={s.id} className="scroll-mt-24">
                <Motion.h3
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  className="text-lg sm:text-xl font-semibold"
                >
                  {s.title}
                </Motion.h3>
                <Motion.ul
                  role="list"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={stagger}
                  className="mt-3 space-y-2"
                >
                  {s.points.map((p, i) => (
                    <Motion.li
                      key={`${s.id}-${i}`}
                      variants={fadeUp}
                      className="flex items-start gap-2 text-sm text-gray-800"
                    >
                      <span
                        className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-black"
                        style={{ background: "var(--gradient-main)" }}
                      >
                        {i + 1}
                      </span>
                      <span>{p}</span>
                    </Motion.li>
                  ))}
                </Motion.ul>
                {idx < steps.length - 1 && (
                  <div className="mt-4">
                    <a
                      href={`#${steps[idx + 1].id}`}
                      className="inline-flex items-center gap-2 text-sm text-black hover:text-black/80"
                    >
                      Next: {steps[idx + 1].title} <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <a href="#step-1" className="btn-outline">
              Back to Top
            </a>
            <Link to="/services" className="btn-primary">
              Hire a Worker <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JinnarDetailed;
