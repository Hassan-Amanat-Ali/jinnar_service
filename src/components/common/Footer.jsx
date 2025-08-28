const Footer = () => {
  return (
    <footer className='border-t text-center text-xs py-6 mt-8'>
      <div className='max-w-6xl mx-auto px-4'>
        © {new Date().getFullYear()} Tanzania Platform
      </div>
    </footer>
  );
};

export default Footer;
