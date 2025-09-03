import { useState } from 'react';
import { LandingPageHeroBg } from '../../assets/index.js';
import {
  FiUsers,
  FiPlay,
  FiMapPin,
  FiSearch,
  FiChevronDown,
} from 'react-icons/fi';

const Hero = () => {
  const categories = [
    'House Cleaning',
    'Carpentry',
    'Electrical Work',
    'Plumbing',
    'Home Repair',
    'Auto Repairing',
    'Pet Care',
  ];
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSelectCategory = (value) => {
    setSelectedCategory(value);
    setCategoryOpen(false);
  };
  return (
    <section className='relative overflow-visible'>
      <div
        className='relative py-28 sm:py-32 md:py-36 bg-center bg-cover'
        style={{ backgroundImage: `url(${LandingPageHeroBg})` }}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/35 to-transparent' />

        <div className='relative z-10 max-w-5xl mx-auto px-4  h-full flex flex-col items-center justify-center text-center text-white'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs mb-4'>
            <span className='opacity-80'>
              Your reliable connection to skilled workers
            </span>
          </div>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight'>
            Find Trusted Workers <span className='text-secondary'>Anytime</span>
          </h1>
          <div className='h-1 w-24 sm:w-40 md:w-56 lg:w-72 bg-white/80 my-2' />
          <p className='mt-1 max-w-2xl text-white/90 text-base sm:text-lg'>
            Your reliable connection to skilled workers in your community.
          </p>

          <div className='mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
            <button className='btn-primary'>
              <FiUsers className='text-black' />
              Find a Worker
            </button>
            <button className='btn-outline'>
              <FiPlay className='text-white' />
              Join as a Worker
            </button>
          </div>

          {/* Search Card */}
          <div className='mt-8 sm:mt-10 w-full max-w-5xl bg-white/95 text-left rounded-2xl sm:rounded-[28px] shadow-xl p-4 sm:p-5 md:p-7 overflow-visible'>
            <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 sm:gap-4 items-end'>
              <div
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setCategoryOpen(false);
                }}
              >
                <h3 className='text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3'>
                  Service Category
                </h3>
                <div className='relative'>
                  <button
                    type='button'
                    aria-haspopup='listbox'
                    aria-expanded={categoryOpen}
                    onClick={() => setCategoryOpen((v) => !v)}
                    className='w-full h-11 sm:h-12 rounded-xl border border-border pl-4 pr-10 text-left text-sm bg-muted'
                  >
                    <span
                      className={
                        selectedCategory ? 'text-black' : 'text-black/50'
                      }
                    >
                      {selectedCategory || 'Choose category'}
                    </span>
                    <FiChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none' />
                  </button>
                  {categoryOpen && (
                    <ul
                      role='listbox'
                      tabIndex={-1}
                      className='absolute z-50 mt-2 w-full max-h-56 overflow-auto scrollbar-hide rounded-xl border border-border bg-white shadow-xl text-black'
                    >
                      {categories.map((c) => (
                        <li
                          key={c}
                          role='option'
                          aria-selected={selectedCategory === c}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectCategory(c)}
                          className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                            selectedCategory === c
                              ? 'bg-secondary/10 text-secondary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <h3 className='text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3'>
                  Location
                </h3>
                <div className='relative'>
                  <FiMapPin className='absolute left-3 top-1/2 -translate-y-1/2 text-black/60' />
                  <input
                    className='w-full h-11 sm:h-12 rounded-xl border border-border pl-9 pr-3 text-sm placeholder:text-black/50 bg-muted/60'
                    placeholder='Enter Your Location'
                  />
                </div>
              </div>
              <div className='md:pl-2'>
                <button className='btn-primary'>
                  <FiSearch />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
