import React from 'react';
import Image from 'next/image';
import TypewriterComponent from 'typewriter-effect';
import dynamic from "next/dynamic";

const Hero = () => {
  return (
    <section className="relative bg-white text-gray-900 min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-dots"></div>
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <div className="glassmorphism p-6 sm:p-8 rounded-lg">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
                Hi, I&apos;m <span className="text-yellow-400">Menajul Hoque</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-300">
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
              
                href="#contact"
                className="bg-yellow-400 text-gray-900 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-yellow-300 transition duration-300 animate-fade-in-up animation-delay-600 inline-block"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 animate-float glassmorphism-circle rounded-full p-4">
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
