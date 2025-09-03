const TopWorkers = () => {
  return (
    <section className='py-16'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-2xl font-semibold text-center mb-8'>
          Meet Our Top Rated Workers
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='rounded-xl border border-border bg-white p-4 shadow-sm'
            >
              <div className='h-24 rounded-lg bg-gray-100 mb-3' />
              <div className='h-3 w-28 bg-gray-200 rounded mb-1.5' />
              <div className='h-3 w-16 bg-gray-200 rounded' />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopWorkers;
