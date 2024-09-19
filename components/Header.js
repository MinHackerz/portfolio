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
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'glassmorphism shadow-md' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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
            <NavLink href="#about" scrolled={scrolled}>
              About
            </NavLink>
            <NavLink href="#skills" scrolled={scrolled}>
              Skills
            </NavLink>
            <NavLink href="#experience" scrolled={scrolled}>
              Experience
            </NavLink>
            <NavLink href="#projects" scrolled={scrolled}>
              Projects
            </NavLink>
            <NavLink href="#contact" scrolled={scrolled}>
              Contact
            </NavLink>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md glassmorphism">
            <NavLink href="#about" mobile>
              About
            </NavLink>
            <NavLink href="#skills" mobile>
              Skills
            </NavLink>
            <NavLink href="#experience" mobile>
              Experience
            </NavLink>
            <NavLink href="#projects" mobile>
              Projects
            </NavLink>
            <NavLink href="#contact" mobile>
              Contact
            </NavLink>
          </div>
        )}
      </header>
    </>
  );
};

const NavLink = ({ href, children, mobile, scrolled }) => (
  <Link
    href={href}
    className={`
      ${mobile ? 'block py-2 px-4 text-gray-800' : 'text-gray-800'}
      hover:text-primary transition duration-300 text-base sm:text-lg font-medium
    `}
  >
    {children}
  </Link>
);

export default dynamic(() => Promise.resolve(Header), { ssr: false });
