import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Hero = () => {
  return (
    <section className="relative bg-white text-gray-900 min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-dots"></div>
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <div className="glassmorphism p-6 sm:p-8 rounded-lg bg-white/30 backdrop-blur-sm shadow-lg">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
                Hi, I&apos;m <span className="text-yellow-500">Menajul Hoque</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-300">
                <span className="inline-block text-black-500">Data Engineer</span>
                <span className="inline-block text-blue-600"> | WordPress Developer</span>
                <span className="inline-block text-green-600"> | SEO Specialist</span>
              </p>
              <a
                href="#contact"
                className="bg-yellow-500 text-gray-900 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-yellow-400 transition duration-300 animate-fade-in-up animation-delay-600 inline-block"
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
              <div className="absolute inset-0 animate-pulse-outline rounded-full"></div>
              {/* Roles around the circular profile picture */}
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-2 py-1 rounded-full hidden lg:block">
                Digital Marketing
              </div>
              <div className="absolute left-[-2rem] top-1/2 transform -translate-y-1/2 bg-yellow-600 text-gray-900 px-2 py-1 rounded-full hidden lg:block">
                Data Engineering
              </div>
              <div className="absolute right-[-2rem] top-1/2 transform -translate-y-1/2 bg-blue-700 text-white px-2 py-1 rounded-full hidden lg:block">
                Web Development
              </div>
              <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 bg-orange-700 text-white px-2 py-1 rounded-full hidden lg:block">
                Prompt Engineering
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default dynamic(() => Promise.resolve(Hero), { ssr: false });
