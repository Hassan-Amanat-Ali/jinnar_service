import { useState } from 'react';
import {
  FiSearch,
  FiCalendar,
  FiCreditCard,
  FiBriefcase,
  FiCheckSquare,
  FiDollarSign,
} from 'react-icons/fi';

const HowItWorks = () => {
  const [audience, setAudience] = useState('customers');

  const customerSteps = [
    {
      icon: <FiSearch className='text-white text-2xl' />,
      title: 'Search for a service',
      desc: 'Browse through our verified workers or search by service type and location. Filter by ratings, price, and availability.',
      color: 'linear-gradient(180deg,#2a6cf4,#1d4ed8)',
    },
    {
      icon: <FiCalendar className='text-white text-2xl' />,
      title: 'Book instantly or schedule',
      desc: 'Choose immediate booking for urgent needs or schedule for a convenient time. Communicate directly with workers.',
      color: 'linear-gradient(180deg,#a855f7,#7c3aed)',
    },
    {
      icon: <FiCreditCard className='text-white text-2xl' />,
      title: 'Pay securely & review',
      desc: 'Complete secure payment through our platform and share your experience to help build trust in the community.',
      color: 'linear-gradient(180deg,#22c55e,#16a34a)',
    },
  ];

  const workerSteps = [
    {
      icon: <FiBriefcase className='text-white text-2xl' />,
      title: 'Create your profile',
      desc: 'Set up your skills, services, pricing and availability. Build trust with a complete profile and portfolio.',
      color: 'linear-gradient(180deg,#06b6d4,#0284c7)',
    },
    {
      icon: <FiCheckSquare className='text-white text-2xl' />,
      title: 'Accept jobs & manage bookings',
      desc: 'Get job requests, confirm bookings, and chat with customers in real-time to finalize details.',
      color: 'linear-gradient(180deg,#f59e0b,#d97706)',
    },
    {
      icon: <FiDollarSign className='text-white text-2xl' />,
      title: 'Get paid securely',
      desc: 'Complete the job and receive secure payments to your wallet. Grow your reputation with reviews.',
      color: 'linear-gradient(180deg,#22c55e,#16a34a)',
    },
  ];

  return (
    <section className='py-16'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='section-title my-6'>How It Works</h2>
        <p className='text-center text-black/70 -mt-6'>
          Simple steps to connect skilled workers with customers in your
          community
        </p>

        {/* Audience toggle pill */}
        <div className='mt-6 flex items-center justify-center'>
          <div className='rounded-full border border-border bg-muted p-1 shadow-sm inline-flex gap-1'>
            <button
              onClick={() => setAudience('customers')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                audience === 'customers' ? 'bg-white shadow' : 'text-black/70'
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setAudience('workers')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                audience === 'workers' ? 'bg-white shadow' : 'text-black/70'
              }`}
            >
              For Workers
            </button>
          </div>
        </div>

        {/* Steps grid */}
        <div className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {(audience === 'customers' ? customerSteps : workerSteps).map(
            (s, i) => (
              <div
                key={i}
                className='rounded-2xl border border-border bg-white shadow-sm p-8 text-center hover:shadow-md transition-shadow'
              >
                <div
                  className='mx-auto mb-6 h-14 w-14 rounded-2xl flex items-center justify-center'
                  style={{ background: s.color }}
                >
                  {s.icon}
                </div>
                <h3 className='text-lg font-semibold text-black'>{s.title}</h3>
                <div className='mx-auto my-3 h-1 w-16 rounded bg-black/20' />
                <p className='text-sm text-black/70 leading-relaxed'>
                  {s.desc}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
