import {
  ArrowLeft,
  Star,
  MapPin,
  Languages,
  MessageCircle,
  CalendarCheck,
  BadgeDollarSign,
  ShieldCheck,
  Wrench,
  Droplets,
  Plug,
  Home,
  Camera,
  Award,
  Clock,
  DollarSign,
  Handshake,
} from "lucide-react";
import aliHassan from "../../assets/images/ali-hassan.jpg";
import work1 from "../../assets/images/services-image-1.jpg";
import work2 from "../../assets/images/services-image-2.jpg";
import work3 from "../../assets/images/services-image-3.jpg";
import work4 from "../../assets/images/services-image-4.jpg";
import work5 from "../../assets/images/worker-card.jpg";
import { useNavigate } from "react-router-dom";

const RatingStars = ({ value = 5, outOf = 5, size = 16 }) => {
  const stars = Array.from({ length: outOf }, (_, i) => i < Math.round(value));
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} out of ${outOf} stars`}
    >
      {stars.map((filled, i) => (
        <Star
          key={i}
          size={size}
          className={
            filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

const ServiceItem = (props) => {
  const { icon: IconComp, title } = props;
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-[#F3F3F3] p-4 ">
      <div className="rounded-xl bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] p-3 shadow-sm">
        <IconComp className="text-white" size={24} />
      </div>
      <span className="mt-2 text-sm font-medium text-gray-500 text-center">
        {title}
      </span>
    </div>
  );
};

const Thumb = ({ src, alt }) => (
  <figure className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  </figure>
);

const WorkerProfile = () => {
  const navigate = useNavigate();
  return (
    <main className="section-container py-4 md:py-6 lg:py-8 max-w-7xl">
      {/* Back link */}
      <nav
        className="relative flex items-center justify-between px-4 mb-5"
        aria-label="Breadcrumb"
      >
        {/* Left: Back button */}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-[#74C7F2] hover:text-[#469DD7]"
          onClick={() => history.back()}
        >
          <ArrowLeft size={16} />
          <span>Back to Services</span>
        </button>

        {/* Center: Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-tight text-gray-900">
          Worker Profile
        </h1>

        <div className="w-[120px] sm:w-[150px]" />
      </nav>

      {/* Header */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full">
        {/* Sidebar profile card */}
        <aside
          aria-label="Worker summary"
          className="grid md:col-span-1 h-fit whitespace-nowrap"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-200 shadow-sm">
                <img
                  src={aliHassan}
                  alt="Ali Hassan"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                Ali Hassan
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars value={4.9} />
                <span className="text-sm text-gray-600">4.9 · 620 reviews</span>
              </div>

              <div className="mt-4 grid w-full grid-cols-1 gap-2">
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#74C7F2] px-3 py-2.5 text-sm text-white">
                  <Award size={16} className="text-white" />8 yrs Experience
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#E6E6E6] px-3 py-2.5 text-sm text-gray-700">
                  <Languages size={16} className="text-gray-500" />
                  Urdu, English, Arabic
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#E6E6E6] px-3 py-2.5 text-sm text-gray-700">
                  <MapPin size={16} className="text-gray-500" />
                  Near Gulshan, 3.9 km
                </div>
              </div>
              <hr className="h-10 w-full mt-10 text-gray-300" />

              <div className=" grid w-full grid-cols-1 gap-3">
                <button
                  className="btn-primary w-full justify-center bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white cursor-pointer"
                  aria-label="Book Now"
                  onClick={() => navigate("/book-worker/ali-hassan")}
                >
                  <CalendarCheck size={18} /> Book Now
                </button>
                <button
                  className="w-full justify-center rounded-md border border-[#74C7F2] bg-white px-4 py-3 text-sm font-semibold text-[#74C7F2] shadow-sm hover:bg-gray-50 inline-flex items-center gap-2 cursor-pointer"
                  aria-label="Message Worker"
                  onClick={() => navigate("/chat")}
                >
                  <MessageCircle size={18} /> Message
                </button>
              </div>

              <div className="flex justify-around items-center mt-4 bg-gray-50 rounded-xl p-2 text-xs py-3.5 w-full">
                <div className="text-center">
                  <p className="font-semibold text-lg">193</p>
                  <p className="text-gray-500">Jobs</p>
                </div>
                <div className="w-px bg-gray-200 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-lg">Negotiable</p>
                  <p className="text-gray-500">Price</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="space-y-6 grid md:col-span-2 ">
          {/* About Me */}
          <section
            aria-labelledby="about-title"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 id="about-title" className="text-lg font-bold text-gray-900">
              About Me
            </h2>
            <p className="mt-3 text-[16px] leading-6 text-gray-700 ">
              Experienced plumber specializing in pipe repairs, installations,
              and fixtures fittings. I provide clean, reliable, and affordable
              services with a focus on customer satisfaction. Available for
              emergency calls 24/7.
            </p>
          </section>

          {/* Services Offer */}
          <section
            aria-labelledby="services-title"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 id="services-title" className="text-lg font-bold text-gray-900">
              Services Offer
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <ServiceItem icon={Wrench} title="Pipe Repair" />
              <ServiceItem icon={ShieldCheck} title="Installations" />
              <ServiceItem icon={Plug} title="Appliance Hookup" />
              <ServiceItem icon={Droplets} title="Leak Fix" />
              <ServiceItem icon={Home} title="New Tank Cleaning" />
              <ServiceItem icon={BadgeDollarSign} title="Inspection" />
            </div>
          </section>

          {/* Work Samples */}
          <section
            aria-labelledby="samples-title"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2
                id="samples-title"
                className="text-lg font-bold text-gray-900"
              >
                My Work Samples
              </h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
              <Thumb src={work1} alt="Work sample 1" />
              <Thumb src={work2} alt="Work sample 2" />
              <Thumb src={work3} alt="Work sample 3" />
              <Thumb src={work4} alt="Work sample 4" />
              <Thumb src={work5} alt="Work sample 5" />
            </div>
          </section>

          {/* Pricing */}
          <section
            aria-labelledby="pricing-title"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 id="pricing-title" className="text-lg font-bold text-gray-900">
              Pricing
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl  bg-gradient-to-r from-[#B6E0FE]/10 to-[#74C7F2]/10 p-4 sm:p-8 text-center flex flex-col items-center justify-center gap-2">
                <Clock className="text-[#74C7F2]" size={32} />
                <p className="text-medium font-semibold text-black leading-none">
                  Hourly Rate
                </p>
                <p className="text-lg font-semibold text-gray-900">$45/hr</p>
              </div>
              <div className="rounded-xl  bg-gradient-to-r from-[#B6E0FE]/10 to-[#74C7F2]/10 p-4 sm:p-8 text-center flex flex-col items-center justify-center gap-2">
                <DollarSign className="text-[#74C7F2]" size={32} />
                <p className="text-medium font-semibold text-black leading-none">
                  Minimum Charge
                </p>
                <p className="text-lg font-semibold text-gray-900">$150</p>
              </div>
              <div className="rounded-xl  bg-gradient-to-r from-[#B6E0FE]/10 to-[#74C7F2]/10 p-4 sm:p-8 text-center flex flex-col items-center justify-center gap-2">
                <Handshake className="text-[#74C7F2]" size={32} />
                <p className="text-medium font-semibold text-black leading-none">
                  Pricing Type
                </p>
                <p className="text-lg font-semibold text-[#74C7F2]">
                  Negotiable
                </p>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section
            aria-labelledby="availability-title"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2
              id="availability-title"
              className="text-lg font-bold text-gray-900"
            >
              Availability
            </h2>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Available Today
                <span className="text-gray-500">
                  · Mon–Sun · 8:00 AM – 8:00 PM
                </span>
              </div>
              <div className="bg-[#D6EEFF] p-5 rounded-xl">
                <p className="text-medium font-bold">Book for Today</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Morning, 10:00–11:30 AM",
                    "Afternoon, 12:30–3:00 PM",
                    "Evening, 4:30–6:00 PM",
                  ].map((slot) => (
                    <span
                      key={slot}
                      className="rounded-lg bg-[#FFFFFF] px-4 py-1.5 text-xs font-medium text-gray-500"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section
            aria-labelledby="reviews-title"
            className="bg-[#FFFBEA] p-5 "
          >
            <h2
              id="reviews-title"
              className="text-lg sm:text-xl font-bold text-gray-900"
            >
              Reviews & Ratings
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Overall score */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-semibold text-gray-900">
                      4.9
                    </span>
                    <Star className="text-yellow-400 fill-yellow-400 w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    1,287 reviews
                  </p>
                </div>

                {/* Rating distribution */}
                <div className="sm:col-span-2 flex flex-col justify-center mt-4 sm:mt-0 space-y-2">
                  {[5, 4, 3, 2, 1].map((n, i) => (
                    <div
                      key={n}
                      className="flex items-center gap-3 text-xs sm:text-sm text-gray-600"
                    >
                      <span className="w-5 text-right">{n}</span>
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-yellow-400"
                          style={{
                            width: ["92%", "70%", "28%", "7%", "3%"][i],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="space-y-4">
              {[
                {
                  name: "Sarah Khan",
                  rating: 5,
                  service: "Pipe Repair",
                  days: "2 days ago",
                  text: "Excellent work! Fixed my kitchen sink quickly and professionally. Highly recommended.",
                },
                {
                  name: "Ahmed Khan",
                  rating: 5,
                  service: "Bathroom Installation",
                  days: "5 days ago",
                  text: "Very punctual and skilled. Completed bathroom installation perfectly.",
                },
                {
                  name: "Ahmed Khan",
                  rating: 4,
                  service: "Leak Fix",
                  days: "1 week ago",
                  text: "Good service and fair pricing. Would hire again for future plumbing needs.",
                },
              ].map((r, idx) => (
                <article
                  key={idx}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={aliHassan}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {r.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-gray-500">{r.service}</p>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <p className="text-xs text-gray-500">{r.days}</p>
                          </div>
                        </div>
                        <RatingStars value={r.rating} />
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{r.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WorkerProfile;
