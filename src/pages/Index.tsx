import { Database, Globe, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <img
            src="/placeholder.svg"
            alt="Menajul Hoque"
            className="w-32 h-32 rounded-full mx-auto mb-8 object-cover border-2 border-accent/20"
          />
          <img
            src="/placeholder.svg"
            alt="Signature"
            className="h-12 mx-auto mb-8 object-contain"
          />
          <h1 className="text-5xl font-light text-primary mb-4">Menajul Hoque</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Crafting digital experiences through data engineering, web development, and digital marketing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link to="/data-engineer" className="group">
            <div className="p-8 rounded-lg border border-primary/10 bg-background hover:border-accent transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Database className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <span className="text-primary text-lg font-light">Data Engineer</span>
                <p className="text-muted text-sm text-center">
                  Building robust data pipelines and analytics solutions
                </p>
              </div>
            </div>
          </Link>
          
          <Link to="/web-developer" className="group">
            <div className="p-8 rounded-lg border border-primary/10 bg-background hover:border-accent transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Globe className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <span className="text-primary text-lg font-light">Web Developer</span>
                <p className="text-muted text-sm text-center">
                  Creating modern and responsive web applications
                </p>
              </div>
            </div>
          </Link>
          
          <Link to="/digital-marketing" className="group">
            <div className="p-8 rounded-lg border border-primary/10 bg-background hover:border-accent transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Megaphone className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <span className="text-primary text-lg font-light">Digital Marketing</span>
                <p className="text-muted text-sm text-center">
                  Driving growth through digital marketing strategies
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;