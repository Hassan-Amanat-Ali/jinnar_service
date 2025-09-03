const CTA = () => {
  return (
    <section
      className='py-16 text-white text-center'
      style={{ background: 'var(--gradient-cta)' }}
    >
      <div className='max-w-3xl mx-auto px-4'>
        <h2 className='text-2xl font-semibold mb-2'>
          Join our growing community today!
        </h2>
        <p className='opacity-90 mb-6'>
          Trusted by thousands. Secure payments. 24/7 support.
        </p>
        <button className='btn-base-medium btn-cta-alt'>Get Started</button>
      </div>
    </section>
  );
};

export default CTA;
