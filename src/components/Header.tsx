import { FC } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, Github } from "lucide-react";

const Header: FC = () => {
  return (
    <header className="w-full">
      {/* Desktop Header */}
      <div className="fixed top-4 left-4 z-50 hidden md:block">
        <div className="flex flex-col items-center">
          <Link to="/" className="mb-2">
            <img src="/Menajul_Sign.svg" alt="Menajul Hoque" className="w-64 h-32 object-contain" />
          </Link>
          <div className="flex flex-col space-y-4 mt-2 bg-glass p-3 rounded-full">
            <a
              href="mailto:menajulhoque99@gmail.com"
              className="text-muted hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/menajul-hoque/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/MinHackerz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-4 my-2 bg-glass border-gradient rounded-full">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img src="/Menajul_Picture.jpg" alt="Menajul Hoque" className="w-10 h-10 rounded-full object-cover" />
              </Link>
              <img src="/Menajul_Sign.svg" alt="Menajul Hoque Signature" className="h-10 w-10 object-contain" />
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:menajulhoque99@gmail.com"
                className="text-muted hover:text-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/menajul-hoque/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/MinHackerz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 