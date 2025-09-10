import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import testimonial1 from "../../assets/images/testimonial1.jpg";
import prev from "../../assets/icons/prev.png";
import next from "../../assets/icons/next.png";

const Testimonials = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Add custom styles for pagination
    const style = document.createElement("style");
    style.textContent = `
      .testimonials-swiper .swiper-pagination {
        position: relative !important;
        bottom: 0 !important;
        margin-top: 1.5rem !important;
      }
      
      .testimonials-swiper .swiper-pagination-bullet {
        width: 8px !important;
        height: 8px !important;
        background: #D1D5DB !important;
        border-radius: 50% !important;
        opacity: 1 !important;
        margin: 0 4px !important;
        transition: all 0.3s ease !important;
      }
      
      .testimonials-swiper .swiper-pagination-bullet-active {
        background: linear-gradient(135deg, #B6E0FE 0%, #74C7F2 100%) !important;
        transform: scale(1.2) !important;
      }
      
      @media (min-width: 640px) {
        .testimonials-swiper .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          margin: 0 6px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Customer",
      image: testimonial1, // Replace with actual image
      text: "My vision came alive effortlessly. Their blend of casual and professional approach made the process a breeze. Creativity flowed, and the results were beyond my expectations.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Customer",
      image: testimonial1, // Replace with actual image
      text: "Outstanding service! The worker was punctual, professional, and exceeded my expectations. I couldn't be happier with the quality of work delivered.",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Customer",
      image: testimonial1, // Replace with actual image
      text: "Fantastic experience from start to finish. The platform made it so easy to find the right professional for my needs. Highly recommended!",
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "Customer",
      image: testimonial1, // Replace with actual image
      text: "Professional, reliable, and affordable. The worker completed the job perfectly and on time. Will definitely use this service again.",
    },
    {
      id: 5,
      name: "David Martinez",
      role: "Customer",
      image: testimonial1, // Replace with actual image
      text: "Great platform with verified professionals. The booking process was smooth and the service quality was top-notch. Very satisfied!",
    },
    {
      id: 6,
      name: "Lisa Thompson",
      role: "Customer",
      image: testimonial1, // Replace with actual image
      text: "Amazing experience! The worker was skilled, friendly, and completed the job beyond my expectations. Excellent value for money.",
    },
  ];

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 md:mb-8">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2">
              What Our Client Said About Us
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Real experiences from our community of workers and customers
            </p>
          </div>
          <div className="flex space-x-2 self-start lg:self-auto lg:mr-4">
            <button
              onClick={handlePrevClick}
              className="bg-[#F8F9FF] h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
            >
              <img
                src={prev}
                alt="Previous"
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 object-cover"
              />
            </button>
            <button
              onClick={handleNextClick}
              className="bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity duration-300"
            >
              <img
                src={next}
                alt="Next"
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 object-cover"
              />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="testimonials-swiper pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="rounded-2xl bg-[#F8F9FF] p-4 sm:p-5 lg:p-6 shadow-sm h-auto min-h-[200px] sm:min-h-[220px] flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover mr-3"
                  />
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {testimonial.name}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed flex-grow">
                  {testimonial.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
