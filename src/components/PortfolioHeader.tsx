import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Github } from 'lucide-react';

const PortfolioHeader: FC = () => {
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl z-50">
      <div className="mx-4 bg-background/80 backdrop-blur-sm border border-primary/10 rounded-full">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                src="/Menajul_Picture.jpg"
                alt="Menajul Hoque"
                className="w-10 h-10 rounded-full object-cover border border-accent/20 cursor-pointer"
              />
            </Link>
            <Link to="/">
              <img
                src="/Menajul_Signature.png"
                alt="Signature"
                className="h-8 object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <a href="mailto:menajulhoque99@gmail.com" className="text-muted hover:text-accent transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/menajul-hoque/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/MinHackerz" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortfolioHeader;