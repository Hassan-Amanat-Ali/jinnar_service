import { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  ChevronDown,
  CircleQuestionMark,
  Ticket,
  Loader2,
  X,
  Send,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetHelpFaqsQuery } from "../../services/faqApi";
import {
  useCreateSupportTicketMutation,
  useGetMyTicketsQuery,
} from "../../services/supportApi";
import toast from "react-hot-toast";
import {useAuth} from "../../context/AuthContext"
const HelpAndSupport = () => {
  const navigate = useNavigate();
  const [openFaqs, setOpenFaqs] = useState({});
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
  });
  const [guestForm, setGuestForm] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const { user } = useAuth();
  const isLoggedIn = !!user; // User is logged in if the 'user' object exists

  // Fetch FAQs from API - always fetch regardless of login status
  const {
    data: faqCategories = [],
    isLoading: isLoadingFaqs,
    isError: isErrorFaqs,
  } = useGetHelpFaqsQuery();

  // Set first category as selected by default when FAQs load
  useEffect(() => {
    if (faqCategories.length > 0 && selectedCategory === null) {
      setSelectedCategory(faqCategories[0].id);
    }
  }, [faqCategories, selectedCategory]);

  // Fetch user's support tickets
  const {
    data: ticketsData,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
    refetch: refetchTickets,
    // Conditionally skip the query if the user is not logged in
  } = useGetMyTicketsQuery(undefined, { skip: !isLoggedIn });
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

    // Validate guest info if user is not logged in
    if (!isLoggedIn) {
      if (!guestForm.email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!guestForm.name.trim()) {
        toast.error("Name is required");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestForm.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    const loadingToast = toast.loading("Submitting your request...");

    try {
      const ticketData = {
        subject: ticketForm.subject,
        message: ticketForm.message,
      };

      // Add guestInfo if user is not logged in
      if (!isLoggedIn) {
        ticketData.guestInfo = {
          email: guestForm.email,
          name: guestForm.name,
          phone: guestForm.phone || "", // Phone is optional
        };
      }

      await createTicket(ticketData).unwrap();

      toast.success("Support ticket submitted successfully!", {
        id: loadingToast,
      });
      handleCloseTicketDialog();

      // Only refetch tickets if user is logged in
      if (isLoggedIn) {
        refetchTickets();
      }
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

  const handleCloseTicketDialog = () => {
    setShowTicketDialog(false);
    setTicketForm({ subject: "", message: "" });
    setGuestForm({ email: "", name: "", phone: "" });
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
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


      </div>

      {/* Contact Support */}
      <div className="mb-8 border border-gray-200 rounded-xl p-5 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Contact Support
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Get in touch with our support team for immediate assistance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* My Support Tickets */}
      {isLoggedIn && (
        <div className="mb-8 border border-gray-200 rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            My Support Tickets
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Track the status of your support requests.
          </p>

          {isLoadingTickets ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48" />
                      <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : isErrorTickets ? (
            <div className="text-center py-8 text-red-500">
              Failed to load support tickets.
            </div>
          ) : ticketsData?.length > 0 ? (
            <div className="space-y-3">
              {ticketsData.map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() =>
                    navigate(`/profile/support-ticket/${ticket._id}`)
                  }
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ticket #{ticket.ticketId} • Last updated:{" "}
                        {formatDate(ticket.updatedAt)}
                      </p>
                    </div>
                    <div
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        ticket.status === "open"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Ticket size={32} className="mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-900">No Tickets Found</h3>
              <p className="text-sm text-gray-500 mt-1">
                You haven't submitted any support tickets yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Frequently Asked Questions */}
      <div className="mb-8">
        {/* FAQ Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions. Can't find what you're looking for?{" "}
            <button
              onClick={() => setShowTicketDialog(true)}
              className="text-[#0EA5E9] hover:text-[#74C7F2] font-medium text-sm"
            >
              Contact support
            </button>
          </p>
        </div>

        {/* Category Tabs */}
        {!isLoadingFaqs && !isErrorFaqs && faqCategories.length > 0 && (
          <div className="max-w-7xl mx-auto mb-6">
            <style>{`
              .category-tabs-scroll::-webkit-scrollbar {
                display: none;
              }
              .category-tabs-scroll {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <div className="flex gap-2 overflow-x-auto lg:flex-wrap lg:justify-center mb-5 category-tabs-scroll pb-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white shadow-md shadow-[#74C7F2]/20"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-[#74C7F2] hover:bg-blue-50"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search FAQs in selected category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#74C7F2] focus:border-[#74C7F2] outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        {isLoadingFaqs ? (
          <div className="max-w-7xl mx-auto space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : isErrorFaqs ? (
          <div className="max-w-2xl mx-auto text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
              <CircleQuestionMark size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-red-900 mb-1">
              Unable to Load FAQs
            </h3>
            <p className="text-red-600 text-sm">
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        ) : faqCategories.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <CircleQuestionMark size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No FAQs Available
            </h3>
            <p className="text-gray-600 text-sm">
              Check back later for helpful answers to common questions.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {(() => {
              // Find the selected category
              const selectedCat = faqCategories.find(
                (cat) => cat.id === selectedCategory
              );

              if (!selectedCat) return null;

              const categoryIndex = faqCategories.findIndex(
                (cat) => cat.id === selectedCategory
              );

              // Filter FAQs based on search query
              const filteredItems = selectedCat.items.filter(
                (faq) =>
                  faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
              );

              // Show no results if search yields nothing
              if (filteredItems.length === 0 && searchQuery) {
                return (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      We couldn't find any FAQs matching "{searchQuery}" in {selectedCat.title}
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[#0EA5E9] hover:text-[#74C7F2] font-medium text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                );
              }

              return (
                <div>
                  {/* Category Title */}
                  <div className="text-center mb-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {selectedCat.title}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {filteredItems.length} {filteredItems.length === 1 ? 'question' : 'questions'} available
                    </p>
                  </div>

                  {/* FAQ Items - Two Column Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredItems.map((faq) => {
                      const actualIndex = selectedCat.items.findIndex(
                        (item) => item.question === faq.question
                      );
                      const isOpen = openFaqs[categoryIndex] === actualIndex;

                      // Helper function to format answer text with bullet points
                      const formatAnswer = (text) => {
                        // Split by bullet points (• or *)
                        const parts = text.split(/[•*]\s+/);

                        if (parts.length > 1) {
                          // First part is usually introductory text
                          const intro = parts[0].trim();
                          const listItems = parts.slice(1).filter(item => item.trim());

                          return (
                            <div className="space-y-2">
                              {intro && <p className="text-gray-700 text-sm leading-relaxed">{intro}</p>}
                              {listItems.length > 0 && (
                                <ul className="space-y-1.5 ml-1">
                                  {listItems.map((item, idx) => (
                                    <li key={idx} className="flex gap-2 text-gray-700 text-sm leading-relaxed">
                                      <span className="text-[#0EA5E9] mt-1 shrink-0 text-xs">•</span>
                                      <span>{item.trim()}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        }

                        return <p className="text-gray-700 text-sm leading-relaxed">{text}</p>;
                      };

                      return (
                        <div
                          key={faq.question}
                          className={`group bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
                            isOpen
                              ? "border-[#0EA5E9] shadow-md shadow-[#74C7F2]/10"
                              : "border-gray-200 hover:border-[#74C7F2]/50 hover:shadow-sm"
                          }`}
                        >
                          <button
                            onClick={() => handleToggleFaq(categoryIndex, actualIndex)}
                            className="w-full flex items-center justify-between gap-3 p-4 text-left"
                          >
                            {/* Question Text */}
                            <span
                              className={`flex-1 font-medium text-sm transition-colors ${
                                isOpen ? "text-[#0EA5E9]" : "text-gray-900 group-hover:text-[#0EA5E9]"
                              }`}
                            >
                              {faq.question}
                            </span>

                            {/* Chevron Icon */}
                            <div
                              className={`shrink-0 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            >
                              <ChevronDown
                                size={18}
                                className={`transition-colors ${
                                  isOpen ? "text-[#0EA5E9]" : "text-gray-400 group-hover:text-[#0EA5E9]"
                                }`}
                              />
                            </div>
                          </button>

                          {/* Answer */}
                          {isOpen && (
                            <div className="px-4 pb-4 pt-0">
                              <div className="pr-6">
                                <div className="pt-3 border-t border-gray-100">
                                  {formatAnswer(faq.answer)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
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
                onClick={handleCloseTicketDialog}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Body */}
            <form onSubmit={handleTicketSubmit} className="p-6 space-y-6">
              {/* Guest Information - Only show when not logged in */}
              {!isLoggedIn && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    📧 Contact Information
                  </p>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={guestForm.email}
                      onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestForm.name}
                      onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={guestForm.phone}
                      onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                      placeholder="+255 123 456 789"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

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
                  Our support team typically responds within 24 hours{!isLoggedIn ? " to the email address you provide" : ""}. For
                  urgent matters, please email us directly at support@jinnar.com.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseTicketDialog}
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
