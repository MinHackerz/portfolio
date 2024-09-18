import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

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
            >
              <FaLinkedin size={28} />
            </a>
            <a
              href="https://github.com/MinHackerz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition duration-300"
            >
              <FaGithub size={28} />
            </a>
            <a
              href="mailto:menajulhoque99@gmail.com"
              className="hover:text-primary transition duration-300"
            >
              <FaEnvelope size={28} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
