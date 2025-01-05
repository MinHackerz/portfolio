import { FC, useEffect } from 'react';
import { Database, Globe, Megaphone } from 'lucide-react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index: FC = () => {
  useEffect(() => {
    document.title = 'Menajul Hoque Portfolio | Home';
  }, []);

  const roles = [
    { title: "Data Engineer", icon: Database, path: "/data-engineer", description: "Building robust data pipelines and analytics solutions" },
    { title: "Web Developer", icon: Globe, path: "/web-developer", description: "Creating modern and responsive web applications" },
    { title: "Digital Marketer", icon: Megaphone, path: "/digital-marketing", description: "Driving growth through digital marketing strategies" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-block">
            <img
              src="/Menajul_Picture.jpg"
              alt="Menajul Hoque"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-accent/20 transition-transform hover:scale-105"
            />
          </Link>
          <img
            src="/Menajul_Signature.png"
            alt="Signature"
            className="h-12 mx-auto object-contain opacity-70 mb-4"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={role.path} className="group block">
                <div className="p-6 rounded-lg border border-primary/10 bg-background hover:bg-accent/5 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4 group-hover:bg-accent/20 transition-colors">
                      <role.icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <h2 className="text-primary text-xl font-semibold group-hover:text-accent transition-colors">{role.title}</h2>
                  </div>
                  <p className="text-muted text-sm flex-grow">{role.description}</p>
                  <div className="mt-4 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore my {role.title} portfolio→
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;