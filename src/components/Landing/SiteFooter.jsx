const SiteFooter = () => {
  return (
    <footer className='bg-slate-900 text-slate-200 py-12 mt-8 text-sm'>
      <div className='max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6'>
        <div>
          <h3 className='font-semibold mb-2'>Tanzania Marketplace</h3>
          <p className='opacity-80'>
            Connecting skilled workers with customers.
          </p>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Quick Links</h3>
          <ul className='space-y-1 opacity-80'>
            <li>Home</li>
            <li>How It Works</li>
            <li>Services</li>
            <li>Workers</li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Support</h3>
          <ul className='space-y-1 opacity-80'>
            <li>Help Center</li>
            <li>FAQ</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Follow Us</h3>
          <p className='opacity-80'>Latest news and features.</p>
        </div>
      </div>
      <div className='text-center mt-8 opacity-80'>
        © {new Date().getFullYear()} TanzaniaMarketplace. All rights reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;
