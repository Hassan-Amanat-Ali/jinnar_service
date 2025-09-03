const PopularServices = () => {
  return (
    <section className='py-16 bg-muted'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-2xl font-semibold text-center mb-2'>
          Popular Services Near You
        </h2>
        <p className='text-center text-gray-600 mb-8'>
          Discover the most requested services in your area with verified
          professionals
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='aspect-[4/3] bg-white border border-border rounded-xl shadow-sm overflow-hidden'
            />
          ))}
        </div>
        <div className='text-center mt-8'>
          <button className='btn-base-medium btn-outline'>
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;
