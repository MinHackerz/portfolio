import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="glassmorphism-footer flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-lg font-semibold">
              &copy; 2024 Menajul Hoque. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/in/menajul-hoque/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition duration-300"
              aria-label="Visit Menajul Hoque's LinkedIn profile"
            >
              <FaLinkedin size={28} />
            </a>
            <a
              href="https://github.com/MinHackerz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition duration-300"
              aria-label="Visit Menajul Hoque's GitHub profile"
            >
              <FaGithub size={28} />
            </a>
            <a
              href="mailto:menajulhoque99@gmail.com"
              className="hover:text-primary transition duration-300"
              aria-label="Send an email to Menajul Hoque"
            >
              <FaEnvelope size={28} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });
