import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CircleQuestionMark,
  Loader2,
  X,
  Send,
} from "lucide-react";
import { useGetHelpFaqsQuery } from "../../services/faqApi";
import { useCreateSupportTicketMutation } from "../../services/supportApi";
import toast from "react-hot-toast";

const HelpAndSupport = () => {
  const [openFaqs, setOpenFaqs] = useState({});
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
  });

  // Fetch FAQs from API
  const {
    data: faqCategories = [],
    isLoading,
    isError,
  } = useGetHelpFaqsQuery();

  // Create support ticket mutation
  const [createTicket, { isLoading: isSubmitting }] =
    useCreateSupportTicketMutation();

  const contactOptions = [
    {
      title: "Email Support",
      description: "support@jinnar.com",
      icon: Mail,
      color: "text-[#0EA5E9]",
      action: () => window.open("mailto:support@jinnar.com"),
    },
    {
      title: "Phone Support",
      description: "+255 123 456 789",
      icon: Phone,
      color: "text-[#0EA5E9]",
      action: () => window.open("tel:+255123456789"),
    },
    {
      title: "Submit Request",
      description: "Send us a message",
      icon: MessageSquare,
      color: "text-[#0EA5E9]",
      action: () => setShowTicketDialog(true),
    },
  ];

  const handleTicketSubmit = async (e) => {
    e.preventDefault();

    if (!ticketForm.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!ticketForm.message.trim()) {
      toast.error("Message is required");
      return;
    }

    const loadingToast = toast.loading("Submitting your request...");

    try {
      await createTicket({
        subject: ticketForm.subject,
        message: ticketForm.message,
      }).unwrap();

      toast.success("Support ticket submitted successfully!", {
        id: loadingToast,
      });
      setShowTicketDialog(false);
      setTicketForm({ subject: "", message: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit ticket", {
        id: loadingToast,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

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
              <button
                key={index}
                onClick={option.action}
                className="p-4 border border-gray-200 rounded-xl hover:border-[#74C7F2] hover:bg-blue-50 transition-all cursor-pointer group text-left"
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
              </button>
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

        {isLoading ? (
          <div className="space-y-6">
            {/* Category Pills Skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* FAQ Items Skeleton */}
            {[1, 2, 3].map((categoryIndex) => (
              <div
                key={categoryIndex}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Category Header Skeleton */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
                </div>

                {/* Questions Skeleton */}
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3].map((questionIndex) => (
                    <div key={questionIndex} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        </div>
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              Failed to load FAQs. Please try again later.
            </p>
          </div>
        ) : (
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
                          onClick={() =>
                            handleToggleFaq(categoryIndex, questionIndex)
                          }
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
        )}
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

      {/* Support Ticket Dialog */}
      {showTicketDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageSquare size={20} className="text-[#0EA5E9]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Submit Support Request
                  </h3>
                  <p className="text-sm text-gray-500">
                    Our team will respond within 24 hours
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTicketDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Body */}
            <form onSubmit={handleTicketSubmit} className="p-6 space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={ticketForm.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                  maxLength={200}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ticketForm.subject.length}/200 characters
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={ticketForm.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your issue in detail..."
                  maxLength={2000}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ticketForm.message.length}/2000 characters
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  💡 Response Time
                </p>
                <p className="text-xs text-blue-600">
                  Our support team typically responds within 24 hours. For
                  urgent matters, please call our phone support line.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTicketDialog(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpAndSupport;
