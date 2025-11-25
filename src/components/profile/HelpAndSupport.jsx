import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CircleQuestionMark,
} from "lucide-react";

const HelpAndSupport = () => {
  const [openFaqs, setOpenFaqs] = useState({});

  const contactOptions = [
    {
      title: "Email Support",
      description: "support@example.com",
      icon: Mail,
      color: "text-[#0EA5E9]",
    },
    {
      title: "Phone Support",
      description: "+1 (800) 123-4567",
      icon: Phone,
      color: "text-[#0EA5E9]",
    },
    {
      title: "Submit Request",
      description: "Send us a message",
      icon: MessageSquare,
      color: "text-[#0EA5E9]",
    },
  ];

  const faqCategories = useMemo(
    () => [
      {
        id: "account",
        title: "Account Setup & Profile",
        items: [
          {
            question: "How can I update my profile information?",
            answer:
              "Go to your Profile page and open 'Profile Overview'. From there, you can edit your personal details, contact information, and preferences. Changes save automatically once you click outside the field.",
          },
          {
            question: "How do I verify my account?",
            answer:
              "Visit the 'Profile Overview' tab and look for the verification banner. Upload the required documents (national ID or business permit) and submit. Our team reviews submissions within 24–48 hours.",
          },
        ],
      },
      {
        id: "bookings",
        title: "Bookings & Scheduling",
        items: [
          {
            question: "How do I book a worker?",
            answer:
              "Browse the Services page, choose a category, and review the list of verified workers. Select a worker to view their profile and click 'Book Now' to send a request with your preferred time and location.",
          },
          {
            question: "How do I cancel or reschedule a booking?",
            answer:
              "Open 'My Bookings' from your profile, choose the booking you want to change, and select cancel or reschedule. For last-minute changes, message the worker through the in-app chat to confirm availability.",
          },
          {
            question: "How do I contact a worker directly?",
            answer:
              "After you submit a booking request, you can chat with the worker using the in-app messaging system. Go to 'Chat' in the main navigation to see active conversations and share any extra details.",
          },
        ],
      },
      {
        id: "payments",
        title: "Payments & Wallet",
        items: [
          {
            question: "How do payments work?",
            answer:
              "Payments are securely held in escrow once a booking is confirmed. Funds are only released to the worker after you mark the job as complete. You can pay using mobile money, bank transfer, or other supported methods.",
          },
          {
            question: "When do workers get paid?",
            answer:
              "Workers receive funds immediately after you confirm job completion. Payments appear in the Jinnar Wallet, where workers can withdraw to mobile money or a linked bank account.",
          },
          {
            question: "Can I get a receipt for my payment?",
            answer:
              "Yes. Receipts are automatically emailed to you and can be downloaded from the 'Payments' section inside your profile.",
          },
        ],
      },
      {
        id: "training",
        title: "Training & Badges",
        items: [
          {
            question: "Where can I find free training courses?",
            answer:
              "Visit the 'How Training Works' page or go directly to training.jinnar.com to access self-paced courses. Completing modules earns you badges that improve your visibility to customers.",
          },
          {
            question: "How do badges appear on my profile?",
            answer:
              "Badges update automatically after you complete each course or assessment. They show up on your public profile and help customers identify specialized skills.",
          },
        ],
      },
      {
        id: "support",
        title: "Support & Safety",
        items: [
          {
            question: "What if I'm not satisfied with the service?",
            answer:
              "If you're unhappy with a job, open 'Complaint Submission' in your profile to file a report. Our support team will review your case and mediate between you and the worker.",
          },
          {
            question: "How can I reach the support team quickly?",
            answer:
              "Use the 'Contact Support' options above to email or call us. For urgent issues, you can also start a live chat from the Help Center inside your account.",
          },
          {
            question: "Are my messages and payments secure?",
            answer:
              "Yes. All chat conversations are encrypted and stored for safety, and every payment is processed through our secure escrow system.",
          },
        ],
      },
    ],
    []
  );

  const handleToggleFaq = (categoryIndex, questionIndex) => {
    setOpenFaqs((prev) => {
      const current = prev[categoryIndex];
      return {
        ...prev,
        [categoryIndex]: current === questionIndex ? null : questionIndex,
      };
    });
  };

  const resources = [
    {
      title: "Getting Started Guide",
      description:
        "Learn how to create your profile and book your first service.",
      category: "guide",
    },
    {
      title: "Safety Guidelines",
      description:
        "Important safety tips for booking and working with service providers.",
      category: "safety",
    },
    {
      title: "Payment Guide",
      description:
        "Understanding our payment system and managing payment methods.",
      category: "payment",
    },
    {
      title: "Troubleshooting",
      description:
        "Common issues and how to resolve them quickly from our help center.",
      category: "troubleshooting",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-sm text-gray-500">
              Get assistance and find answers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft size={16} className="text-black" />
          <CircleQuestionMark size={16} className="text-[#38BDF8]" />
          <span className="text-lg text-black mt-1 font-bold ">
            Help & Support
          </span>
        </div>
        <p className="text-sm">
          Find answers to common questions or contact our support team.
        </p>
      </div>

      {/* Contact Support */}
      <div className="mb-8 border border-gray-200 rounded-xl p-5 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Contact Support
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Get in touch with our support team for immediate assistance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-xl hover:border-[#74C7F2] hover:bg-blue-50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                    <IconComponent size={20} className={option.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mb-8 border border-gray-200 rounded-xl p-5 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Find quick answers to common questions about our platform.
        </p>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#faq-${category.id}`}
                className="px-3 py-1.5 text-sm rounded-full border border-gray-300 hover:border-[#74C7F2] hover:bg-blue-50 transition-colors"
              >
                {category.title}
              </a>
            ))}
          </div>

          {faqCategories.map((category, categoryIndex) => (
            <div
              key={category.id}
              id={`faq-${category.id}`}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  {category.title}
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {category.items.map((faq, questionIndex) => {
                  const isOpen = openFaqs[categoryIndex] === questionIndex;
                  return (
                    <div key={faq.question}>
                      <button
                        onClick={() => handleToggleFaq(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-gray-900 font-medium">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp size={16} className="text-[#0EA5E9]" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 bg-white">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources & Guides */}
      <div className="mb-8 border border-gray-200 rounded-xl p-5 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Resources & Guides
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Helpful guides and resources to get the most out of our platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:border-[#74C7F2] hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <h3 className="font-medium text-gray-900 mb-2 group-hover:text-[#0EA5E9]">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Settings */}
      <div className="pt-6 border-t border-gray-200">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#74C7F2] transition-colors">
          <ArrowLeft size={16} />
          Back to Settings
        </button>
      </div>
    </div>
  );
};

export default HelpAndSupport;
