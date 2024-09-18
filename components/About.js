import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="absolute inset-0 bg-circles"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-800" data-aos="fade-up">
          About Me
        </h2>
        <div
          className="max-w-3xl mx-auto bg-white bg-opacity-10 p-8 rounded-lg shadow-lg backdrop-blur-md"
          data-aos="fade-up"
        >
          <p className="text-lg mb-6 leading-relaxed">
            I'm a results-driven Data Engineer with a strong background in ETL development
            and data analysis. My expertise lies in designing and implementing robust data
            pipelines, optimizing data workflows, and translating complex business
            requirements into efficient, scalable technical solutions.
          </p>
          <p className="text-lg mb-6 leading-relaxed">
            In addition to my data engineering skills, I have experience in digital marketing.
            I've created websites using WordPress and performed technical SEO, including on-page
            and off-page SEO, as well as setting up Google Analytics and Google AdSense.
          </p>
          <p className="text-lg leading-relaxed">
            I'm passionate about solving complex data challenges and continuously expanding
            my skillset. When I'm not working, you can find me traveling, reading books,
            cycling, or watching movies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;