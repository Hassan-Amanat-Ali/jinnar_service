import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@workconnect.com",
    href: "mailto:hello@workconnect.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Monday – Friday, 9:00 AM – 6:00 PM EAT",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="text-white"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div className="section-container py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Contact <span className="text-secondary">Jinnar</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/85 max-w-2xl mx-auto">
            Our team is here to help with partnerships, support requests, and
            general inquiries. Reach out and we will get back to you soon.
          </p>
        </div>
      </section>

      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactDetails.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-muted/60 p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--gradient-main)" }}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 block text-lg font-medium text-black hover:text-secondary transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-lg font-medium text-black">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-black mb-3">
            Prefer to message us?
          </h2>
          <p className="text-black/70">
            Visit the Help Center inside your account for live chat and support
            articles tailored to your role.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;

