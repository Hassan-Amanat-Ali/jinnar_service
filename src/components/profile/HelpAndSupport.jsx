import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  CircleQuestionMark,
} from "lucide-react";

const HelpAndSupport = () => {
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

  const faqItems = [
    "How do I book a worker?",
    "How do I cancel or reschedule a booking?",
    "How do payments work?",
    "How can I update my profile information?",
    "What if I'm not satisfied with the service?",
    "How do I contact a worker directly?",
  ];

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

        <div className="space-y-3">
          {faqItems.map((question, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#74C7F2] hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <span className="text-gray-900 group-hover:text-[#0EA5E9]">
                {question}
              </span>
              <ChevronRight
                size={16}
                className="text-gray-400 group-hover:text-[#0EA5E9]"
              />
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
