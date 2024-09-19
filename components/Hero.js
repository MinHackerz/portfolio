import React from 'react';
import Image from 'next/image';
import TypewriterComponent from 'typewriter-effect';
import dynamic from "next/dynamic";

const Hero = () => {
  return (
    <section className="relative bg-white text-gray-900 min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-dots"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <div className="glassmorphism p-8 rounded-lg">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                Hi, I'm <span className="text-yellow-400">Menajul Hoque</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-300">
                <TypewriterComponent
                  options={{
                    strings: [
                      'I am a Data Engineer',
                      'I am a Web Developer',
                      'I am a Digital Marketer',
                      'I am an AI Enthusiast',
                    ],
                    autoStart: true,
                    loop: true,
                    cursor: '',
                    wrapperClassName: 'text-yellow-400',
                    cursorClassName: 'text-yellow-400',
                    colors: ['#FBBF24', '#3B82F6', '#10B981', '#F59E0B'],
                    delay: 100,
                    deleteSpeed: 50,
                  }}
                />
              </p>
              <a
                href="#contact"
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition duration-300 animate-fade-in-up animation-delay-600 inline-block"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float glassmorphism-circle rounded-full p-4">
              <Image
                src="/profile-picture.jpg"
                alt="Menajul Hoque"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default dynamic (() => Promise.resolve(Hero), {ssr: false})
