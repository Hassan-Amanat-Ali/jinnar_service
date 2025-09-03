const Testimonials = () => {
  return (
    <section className='py-16'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-2xl font-semibold mb-6'>
          What Our Client Said About Us
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='rounded-xl border bg-white p-4 shadow-sm h-32'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
