import { Database, Globe, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
      <img
        src="/placeholder.svg"
        alt="Menajul Hoque"
        className="w-48 h-48 rounded-full mb-8 object-cover"
      />
      <img
        src="/placeholder.svg"
        alt="Signature"
        className="h-16 mb-12 object-contain"
      />
      
      <h1 className="text-4xl font-light text-primary mb-8">Menajul Hoque</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl">
        <Link to="/data-engineer" className="group">
          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-105">
            <Database className="w-16 h-16 text-primary mb-4" />
            <span className="text-primary text-lg font-light">Data Engineer</span>
          </div>
        </Link>
        
        <Link to="/web-developer" className="group">
          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-105">
            <Globe className="w-16 h-16 text-primary mb-4" />
            <span className="text-primary text-lg font-light">Web Developer</span>
          </div>
        </Link>
        
        <Link to="/digital-marketing" className="group">
          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-105">
            <Megaphone className="w-16 h-16 text-primary mb-4" />
            <span className="text-primary text-lg font-light">Digital Marketing</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Index;