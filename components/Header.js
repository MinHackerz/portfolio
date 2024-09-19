import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glassmorphism shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/Minhaj Logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="logo-rotate rotate-on-hover"
              />
              <span className="ml-2 text-xl sm:text-2xl font-bold transition-colors duration-300 text-gray-800 rotate-on-hover">
                MHQ
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <NavLink href="#about" scrolled={scrolled}>About</NavLink>
              <NavLink href="#skills" scrolled={scrolled}>Skills</NavLink>
              <NavLink href="#experience" scrolled={scrolled}>Experience</NavLink>
              <NavLink href="#projects" scrolled={scrolled}>Projects</NavLink>
              <NavLink href="#contact" scrolled={scrolled}>Contact</NavLink>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                className="text-gray-800 p-2"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            {isMenuOpen && (
              <div className="md:hidden w-full mt-2">
                <NavLink href="#about" mobile>About</NavLink>
                <NavLink href="#skills" mobile>Skills</NavLink>
                <NavLink href="#experience" mobile>Experience</NavLink>
                <NavLink href="#projects" mobile>Projects</NavLink>
                <NavLink href="#contact" mobile>Contact</NavLink>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

const NavLink = ({ href, children, mobile, scrolled }) => (
  <Link
    href={href}
    className={`
      ${mobile ? 'block py-2 px-4 text-gray-800 hover:bg-gray-100' : 'text-gray-800'}
      hover:text-primary transition duration-300 text-base sm:text-lg font-medium
    `}
  >
    {children}
  </Link>
);

export default dynamic(() => Promise.resolve(Header), { ssr: false });
