import { type FC, useEffect, useState } from "react"
import { Database, Globe, Megaphone } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Footer from "@/components/Footer"

const Index: FC = () => {
  useEffect(() => {
    document.title = "Menajul Hoque Portfolio | Home"
    
    // Add necessary styles for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dataFlow {
        0% { stroke-dashoffset: 1000; opacity: 0.3; }
        100% { stroke-dashoffset: 0; opacity: 1; }
      }
      
      @keyframes codeTyping {
        0%, 100% { width: 0; }
        50% { width: 100%; }
      }
      
      @keyframes ping {
        0% { transform: scale(1); opacity: 1; }
        75%, 100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5)); }
        50% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .role-card .card-content {
        transition: opacity 0.3s ease-in-out;
      }
      
      .role-card:hover .card-content {
        opacity: 0;
      }
      
      .data-pipeline,
      .code-typing,
      .social-marketing {
        opacity: 0;
        transition: all 0.4s ease-in-out;
        transform: scale(0.9);
      }
      
      .role-card:hover .data-pipeline,
      .role-card:hover .code-typing,
      .role-card:hover .social-marketing {
        opacity: 1;
        transform: scale(1);
      }
      
      .data-pipeline path, .data-pipeline rect, .data-pipeline circle {
        animation: dataFlow 2s linear infinite;
      }
      
      .cursor {
        animation: blink 1s steps(1) infinite;
      }
      
      .code-line {
        width: 0;
        animation: codeTyping 3s steps(30) infinite;
      }
      
      .social-icon {
        animation: float 3s ease-in-out infinite;
      }
      
      .ping-effect {
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      
      .glow-effect {
        animation: glow 2s ease-in-out infinite;
      }
      
      .rotate-effect {
        animation: rotate 8s linear infinite;
      }
      
      .shimmer-effect {
        background: linear-gradient(90deg, 
          rgba(255,255,255,0) 0%, 
          rgba(255,255,255,0.2) 25%, 
          rgba(255,255,255,0.2) 50%, 
          rgba(255,255,255,0) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup when component unmounts
      document.head.removeChild(style);
    };
  }, []);

  const roles = [
    {
      title: "Data Engineer",
      icon: Database,
      path: "/data-engineer",
      description: "Building robust data pipelines and analytics solutions",
    },
    {
      title: "Web Developer",
      icon: Globe,
      path: "/web-developer",
      description: "Creating modern and responsive web applications",
    },
    {
      title: "Digital Marketer",
      icon: Megaphone,
      path: "/digital-marketing",
      description: "Driving growth through digital marketing strategies",
    },
  ]

  const renderAnimationForRole = (title: string) => {
    switch(title) {
      case "Data Engineer":
        return (
          <div className="data-pipeline absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0.8)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Database Source */}
              <rect x="20" y="30" width="45" height="65" rx="5" fill="transparent" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1.5" filter="url(#glow)" />
              <rect x="25" y="38" width="35" height="5" rx="2" fill="rgba(59, 130, 246, 0.8)" />
              <rect x="25" y="48" width="35" height="5" rx="2" fill="rgba(59, 130, 246, 0.5)" />
              <rect x="25" y="58" width="35" height="5" rx="2" fill="rgba(59, 130, 246, 0.3)" />
              <rect x="25" y="68" width="35" height="5" rx="2" fill="rgba(59, 130, 246, 0.2)" />
              <rect x="25" y="78" width="35" height="5" rx="2" fill="rgba(59, 130, 246, 0.1)" />
              
              {/* ETL Process */}
              <g className="rotate-effect" style={{ transformOrigin: '120px 55px' }}>
                <rect x="95" y="40" width="50" height="30" rx="5" fill="transparent" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="1.5" filter="url(#glow)" />
                <text x="120" y="58" fontSize="10" textAnchor="middle" fill="rgba(139, 92, 246, 0.9)" fontWeight="bold">ETL</text>
                <circle cx="120" cy="55" r="18" fill="transparent" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
              </g>
              
              {/* Data Warehouse */}
              <rect x="175" y="30" width="45" height="65" rx="5" fill="transparent" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="1.5" filter="url(#glow)" />
              <rect x="180" y="38" width="35" height="5" rx="2" fill="rgba(16, 185, 129, 0.8)" />
              <rect x="180" y="48" width="35" height="5" rx="2" fill="rgba(16, 185, 129, 0.5)" />
              <rect x="180" y="58" width="35" height="5" rx="2" fill="rgba(16, 185, 129, 0.3)" />
              <rect x="180" y="68" width="35" height="5" rx="2" fill="rgba(16, 185, 129, 0.2)" />
              <rect x="180" y="78" width="35" height="5" rx="2" fill="rgba(16, 185, 129, 0.1)" />
              
              {/* Network Connections */}
              <path d="M 65 55 C 75 55, 85 55, 95 55" fill="none" stroke="url(#dataFlow)" strokeWidth="2" strokeDasharray="6,3" strokeLinecap="round" style={{ animationDelay: '0s' }} />
              <path d="M 145 55 C 155 55, 165 55, 175 55" fill="none" stroke="url(#dataFlow)" strokeWidth="2" strokeDasharray="6,3" strokeLinecap="round" style={{ animationDelay: '0.5s' }} />
              
              {/* Data Packets */}
              <circle cx="75" cy="55" r="4" fill="rgba(59, 130, 246, 0.9)" filter="url(#glow)" style={{ animationDelay: '0.2s' }} />
              <circle cx="160" cy="55" r="4" fill="rgba(139, 92, 246, 0.9)" filter="url(#glow)" style={{ animationDelay: '0.7s' }} />
              
              {/* Labels */}
              <g className="glow-effect">
                <text x="42" y="110" fontSize="10" textAnchor="middle" fill="black" fontWeight="bold">Source</text>
                <text x="42" y="122" fontSize="8" textAnchor="middle" fill="rgba(194, 194, 194, 0.8)">Database</text>
                <text x="120" y="110" fontSize="10" textAnchor="middle" fill="black" fontWeight="bold">Transform</text>
                <text x="120" y="122" fontSize="8" textAnchor="middle" fill="rgba(194, 194, 194, 0.8)">Extract & Load</text>
                <text x="197" y="110" fontSize="10" textAnchor="middle" fill="black" fontWeight="bold">Target</text>
                <text x="197" y="122" fontSize="8" textAnchor="middle" fill="rgba(187, 187, 187, 0.8)">Data Warehouse</text>
              </g>
              
              {/* Status Indicators */}
              <circle cx="42" cy="140" r="5" fill="transparent" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1.5" className="ping-effect" style={{ animationDelay: '0s' }} />
              <circle cx="120" cy="140" r="5" fill="transparent" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="1.5" className="ping-effect" style={{ animationDelay: '0.3s' }} />
              <circle cx="197" cy="140" r="5" fill="transparent" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="1.5" className="ping-effect" style={{ animationDelay: '0.6s' }} />
            </svg>
          </div>
        );
      
      case "Web Developer":
        return (
          <div className="code-typing absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <filter id="webGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="codeGradient">
                  <stop offset="0%" stopColor="#61dafb" />
                  <stop offset="50%" stopColor="#764abc" />
                  <stop offset="100%" stopColor="#ff6b6b" />
                </linearGradient>
              </defs>
              
              {/* Modern Monitor */}
              <rect x="35" y="20" width="170" height="100" rx="8" fill="transparent" stroke="#9ca3af" strokeWidth="2" />
              <rect x="40" y="25" width="160" height="85" rx="4" fill="transparent" stroke="#9ca3af" strokeWidth="1" />
              
              {/* Monitor Stand */}
              <path d="M 110 120 L 95 140 L 145 140 L 130 120 Z" fill="transparent" stroke="#9ca3af" strokeWidth="1.5" />
              <rect x="105" y="135" width="30" height="5" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="1" />
              
              {/* Browser UI */}
              <rect x="45" y="30" width="150" height="15" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="1" />
              
              {/* Browser Controls */}
              <circle cx="52" cy="37.5" r="3" fill="#ef4444" stroke="none" />
              <circle cx="62" cy="37.5" r="3" fill="#f59e0b" stroke="none" />
              <circle cx="72" cy="37.5" r="3" fill="#10b981" stroke="none" />
              
              {/* URL Bar */}
              <rect x="85" y="32.5" width="100" height="10" rx="5" fill="transparent" stroke="#d1d5db" strokeWidth="1" />
              <text x="140" y="40" fontSize="7" textAnchor="middle" fill="#9ca3af">mywebsite.com</text>
              
              {/* Code Editor and Preview Split */}
              <line x1="45" y1="50" x2="195" y2="50" stroke="#6b7280" strokeWidth="1" />
              <line x1="120" y1="50" x2="120" y2="110" stroke="#6b7280" strokeWidth="1" />
              
              {/* Code Editor */}
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '0s' }}>
                <rect x="50" y="55" width="65" height="2.5" rx="1" fill="#93c5fd" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '0.4s' }}>
                <rect x="55" y="61" width="55" height="2.5" rx="1" fill="#a5b4fc" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '0.8s' }}>
                <rect x="55" y="67" width="60" height="2.5" rx="1" fill="#c4b5fd" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '1.2s' }}>
                <rect x="60" y="73" width="45" height="2.5" rx="1" fill="#f9a8d4" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '1.6s' }}>
                <rect x="55" y="79" width="50" height="2.5" rx="1" fill="#a5b4fc" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '2.0s' }}>
                <rect x="50" y="85" width="60" height="2.5" rx="1" fill="#93c5fd" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '2.4s' }}>
                <rect x="55" y="91" width="40" height="2.5" rx="1" fill="#fbcfe8" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '2.8s' }}>
                <rect x="50" y="97" width="65" height="2.5" rx="1" fill="#93c5fd" />
              </g>
              <g className="code-line" style={{ transformOrigin: 'left', animationDelay: '3.2s' }}>
                <rect x="55" y="103" width="55" height="2.5" rx="1" fill="#a5b4fc" />
              </g>
              
              {/* Blinking Cursor */}
              <rect x="115" y="55" width="2" height="10" rx="1" fill="white" className="cursor" />
              
              {/* Preview */}
              {/* Header */}
              <rect x="125" y="55" width="65" height="8" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="0.5" />
              
              {/* Hero Section */}
              <rect x="125" y="68" width="65" height="20" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="0.5" />
              <rect x="130" y="72" width="25" height="3" rx="1.5" fill="#f59e0b" />
              <rect x="130" y="78" width="55" height="2" rx="1" fill="#d1d5db" />
              <rect x="130" y="82" width="40" height="2" rx="1" fill="#d1d5db" />
              
              {/* Three Cards */}
              <rect x="125" y="93" width="18" height="12" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="0.5" />
              <rect x="148" y="93" width="18" height="12" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="0.5" />
              <rect x="171" y="93" width="18" height="12" rx="2" fill="transparent" stroke="#9ca3af" strokeWidth="0.5" />
              
              {/* Connecting Lines for Dev-to-Preview */}
              <path d="M 115 61 C 118 61, 121 72, 125 72" fill="none" stroke="#f59e0b" strokeWidth="0.7" strokeDasharray="2,1" className="glow-effect" />
              <path d="M 115 79 C 118 79, 120 78, 130 78" fill="none" stroke="#d1d5db" strokeWidth="0.7" strokeDasharray="2,1" />
              <path d="M 115 97 C 118 97, 120 93, 125 93" fill="none" stroke="#9ca3af" strokeWidth="0.7" strokeDasharray="2,1" />
              
              {/* Animation Effects */}
              <circle cx="115" cy="61" r="2" fill="#f59e0b" filter="url(#webGlow)" className="ping-effect" style={{ animationDelay: '0.4s' }} />
              <circle cx="115" cy="79" r="2" fill="#d1d5db" filter="url(#webGlow)" className="ping-effect" style={{ animationDelay: '1.2s' }} />
              <circle cx="115" cy="97" r="2" fill="#9ca3af" filter="url(#webGlow)" className="ping-effect" style={{ animationDelay: '2.8s' }} />
              
              {/* Tools */}
              <g className="float-effect" style={{ animationDelay: '0.2s' }}>
                <circle cx="205" cy="35" r="5" fill="transparent" stroke="#f59e0b" strokeWidth="1" />
                <text x="205" y="38" fontSize="7" textAnchor="middle" fill="#f59e0b">JS</text>
              </g>
              <g className="float-effect" style={{ animationDelay: '0.6s' }}>
                <circle cx="205" cy="50" r="5" fill="transparent" stroke="#60a5fa" strokeWidth="1" />
                <text x="205" y="53" fontSize="7" textAnchor="middle" fill="#60a5fa">CSS</text>
              </g>
              <g className="float-effect" style={{ animationDelay: '1.0s' }}>
                <circle cx="205" cy="65" r="5" fill="transparent" stroke="#a5b4fc" strokeWidth="1" />
                <text x="205" y="68" fontSize="7" textAnchor="middle" fill="#a5b4fc">Rx</text>
              </g>
              <g className="float-effect" style={{ animationDelay: '1.4s' }}>
                <circle cx="205" cy="80" r="5" fill="transparent" stroke="#34d399" strokeWidth="1" />
                <text x="205" y="83" fontSize="7" textAnchor="middle" fill="#34d399">Vue</text>
              </g>
              <g className="float-effect" style={{ animationDelay: '1.8s' }}>
                <circle cx="205" cy="95" r="5" fill="transparent" stroke="#f472b6" strokeWidth="1" />
                <text x="205" y="98" fontSize="7" textAnchor="middle" fill="#f472b6">Nx</text>
              </g>
              
              {/* Responsive Design Icons */}
              <g className="float-effect" style={{ animationDelay: '0.4s' }}>
                <rect x="30" y="40" r="5" width="10" height="16" rx="1" fill="transparent" stroke="#9ca3af" strokeWidth="1" />
              </g>
              <g className="float-effect" style={{ animationDelay: '1.2s' }}>
                <rect x="25" y="65" r="5" width="16" height="12" rx="1" fill="transparent" stroke="#9ca3af" strokeWidth="1" />
              </g>
              <g className="float-effect" style={{ animationDelay: '2.0s' }}>
                <rect x="23" y="85" r="5" width="20" height="15" rx="1" fill="transparent" stroke="#9ca3af" strokeWidth="1" />
              </g>
            </svg>
          </div>
        );
      
      case "Digital Marketer":
        return (
          <div className="social-marketing absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <filter id="socialGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="graphLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(124, 58, 237, 0.8)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.8)" />
                </linearGradient>
              </defs>
              
              {/* Central Device/Dashboard */}
              <rect x="85" y="50" width="70" height="100" rx="10" fill="transparent" stroke="rgba(71, 85, 105, 0.8)" strokeWidth="2" filter="url(#socialGlow)" />
              <rect x="90" y="60" width="60" height="35" rx="3" fill="transparent" stroke="rgba(100, 116, 139, 0.5)" strokeWidth="1" />
              <rect x="95" y="70" width="50" height="5" rx="2.5" fill="rgba(236, 72, 153, 0.6)" />
              <rect x="95" y="80" width="40" height="5" rx="2.5" fill="rgba(16, 185, 129, 0.6)" />
              <rect x="95" y="90" width="25" height="5" rx="2.5" fill="rgba(59, 130, 246, 0.6)" />
              
              {/* Analytics Chart in Device */}
              <rect x="90" y="100" width="60" height="40" rx="3" fill="transparent" stroke="rgba(100, 116, 139, 0.5)" strokeWidth="1" />
              <polyline points="95,130 105,120 115,125 125,110 135,115 145,100" fill="none" stroke="url(#graphLine)" strokeWidth="2" />
              <circle cx="145" cy="100" r="3" fill="rgba(239, 68, 68, 0.8)" filter="url(#socialGlow)" />
              
              {/* Device Button */}
              <circle cx="120" cy="145" r="5" fill="rgba(100, 116, 139, 0.8)" />
              
              {/* Social Media Platforms with Floating Effect */}
              <g className="social-icon" style={{ animationDelay: '0s' }}>
                <circle cx="40" cy="35" r="16" fill="transparent" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="2" filter="url(#socialGlow)" />
                <text x="40" y="40" fontSize="14" textAnchor="middle" fill="rgba(59, 130, 246, 0.9)" fontWeight="bold">f</text>
              </g>
              
              <g className="social-icon" style={{ animationDelay: '0.4s' }}>
                <circle cx="40" cy="95" r="16" fill="transparent" stroke="rgba(236, 72, 153, 0.9)" strokeWidth="2" filter="url(#socialGlow)" />
                <text x="40" y="100" fontSize="14" textAnchor="middle" fill="rgba(236, 72, 153, 0.9)" fontWeight="bold">in</text>
              </g>
              
              <g className="social-icon" style={{ animationDelay: '0.2s' }}>
                <circle cx="200" cy="35" r="16" fill="transparent" stroke="rgba(16, 185, 129, 0.9)" strokeWidth="2" filter="url(#socialGlow)" />
                <text x="200" y="40" fontSize="14" textAnchor="middle" fill="rgba(16, 185, 129, 0.9)" fontWeight="bold">tw</text>
              </g>
              
              <g className="social-icon" style={{ animationDelay: '0.6s' }}>
                <circle cx="200" cy="95" r="16" fill="transparent" stroke="rgba(245, 158, 11, 0.9)" strokeWidth="2" filter="url(#socialGlow)" />
                <text x="200" y="100" fontSize="14" textAnchor="middle" fill="rgba(245, 158, 11, 0.9)" fontWeight="bold">yt</text>
              </g>
              
              {/* Connection Lines with Data Flow */}
              <path d="M 55 35 C 65 35, 75 40, 85 60" fill="none" stroke="rgba(59, 130, 246, 0.9)" strokeWidth="2" strokeDasharray="4,2" />
              <path d="M 55 95 C 65 95, 75 90, 85 80" fill="none" stroke="rgba(236, 72, 153, 0.9)" strokeWidth="2" strokeDasharray="4,2" />
              <path d="M 185 35 C 175 35, 165 40, 155 60" fill="none" stroke="rgba(16, 185, 129, 0.9)" strokeWidth="2" strokeDasharray="4,2" />
              <path d="M 185 95 C 175 95, 165 90, 155 80" fill="none" stroke="rgba(245, 158, 11, 0.9)" strokeWidth="2" strokeDasharray="4,2" />
              
              {/* Data Packets */}
              <circle cx="65" cy="35" r="4" fill="rgba(59, 130, 246, 0.9)" className="ping-effect" style={{ animationDelay: '0.1s' }} />
              <circle cx="65" cy="95" r="4" fill="rgba(236, 72, 153, 0.9)" className="ping-effect" style={{ animationDelay: '0.5s' }} />
              <circle cx="175" cy="35" r="4" fill="rgba(16, 185, 129, 0.9)" className="ping-effect" style={{ animationDelay: '0.3s' }} />
              <circle cx="175" cy="95" r="4" fill="rgba(245, 158, 11, 0.9)" className="ping-effect" style={{ animationDelay: '0.7s' }} />
              
              {/* KPI Indicators */}
              <g className="glow-effect">
                <circle cx="40" cy="140" r="10" fill="transparent" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" />
                <text x="40" y="144" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">+24%</text>
                
                <circle cx="200" cy="140" r="10" fill="transparent" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1" />
                <text x="200" y="144" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">+47%</text>
              </g>
            </svg>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto w-full flex-grow relative z-10">
          <motion.div
            className="text-center mb-16 mt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-block">
              <img
                src="/Menajul_Picture.jpg"
                alt="Menajul Hoque"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover transition-all duration-300 hover:border hover:border-orange-500 shadow-lg"
              />
            </Link>
            <img src="/Menajul_Signature.svg" alt="Signature" className="h-12 mx-auto object-contain opacity-70 mb-4" />
            <p className="text-muted text-lg mt-4">
              <span className="text-gradient font-medium">Data Engineer</span> | <span className="text-gradient font-medium">Full-Stack Developer</span> | <span className="text-gradient font-medium">Digital Marketer</span> | <span className="text-gradient font-medium">Entrepreneur</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={role.path} className="group block">
                  <div className="p-6 rounded-lg bg-glass card-gradient border-gradient hover:border-orange-500 transition-all duration-300 h-full flex flex-col group relative overflow-hidden role-card">
                    {renderAnimationForRole(role.title)}
                    <div className="card-content relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mr-4 transition-colors group-hover:bg-orange-100">
                          <role.icon className="w-5 h-5 text-primary transition-colors group-hover:text-orange-700" />
                        </div>
                        <h2 className="text-primary text-xl font-semibold transition-colors group-hover:text-orange-700">
                          {role.title}
                        </h2>
                      </div>
                      <p className="text-muted text-sm flex-grow group-hover:text-orange-700">{role.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Index