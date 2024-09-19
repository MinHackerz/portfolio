import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import dynamic from "next/dynamic";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="about" className="py-16 sm:py-20 bg-white relative px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-circles"></div>
      <div className="container mx-auto relative z-10 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 sm:mb-12 text-center text-gray-800" data-aos="fade-up">
          About Me
        </h2>
        <div
          className="bg-white bg-opacity-10 p-6 sm:p-8 rounded-lg shadow-lg backdrop-blur-md"
          data-aos="fade-up"
        >
          <p className="text-base sm:text-lg mb-6 leading-relaxed">
            I&apos;m a results-driven Data Engineer with a strong background in ETL development
            and data analysis. My expertise lies in designing and implementing robust data
            pipelines, optimizing data workflows, and translating complex business
            requirements into efficient, scalable technical solutions.
          </p>
          <p className="text-base sm:text-lg mb-6 leading-relaxed">
            In addition to my data engineering skills, I have experience in digital marketing.
            I&apos;ve created websites using WordPress and performed technical SEO, including on-page
            and off-page SEO, as well as setting up Google Analytics and Google AdSense.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            I&apos;m passionate about solving complex data challenges and continuously expanding
            my skillset. When I&apos;m not working, you can find me traveling, reading books,
            cycling, or watching movies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default dynamic (() => Promise.resolve(About), {ssr: false})
