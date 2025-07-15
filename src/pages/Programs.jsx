import React from "react";
import { Link } from "react-router-dom";
import { FaDownload, FaMobile } from "react-icons/fa";
import MyRegisterButton from "../components/MyRegisterButton";
import MyButton from "../components/MyButton";
import codeAPillar from "../assets/codeAPillar.png";
import legoBlocks from "../assets/legoBlocks.png";
// import kidsSmiling from "../assets/kidsSmiling.png";

const Programs = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 text-gray-900 font-sans">
      <header className="text-center mb-12">
        <h1
          className="text-4xl font-extrabold text-pink-700 mt-20 mb-4"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          🌟 SmarTplay, Big Smiles: Our Fun Learning Programs
        </h1>
        <p
          className="text-lg max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"
          data-aos="zoom-in-up"
          data-aos-delay="300"
        >
          Welcome to <strong>Young Eagles</strong> – where learning is a joyful adventure!
          Our preschool programs, designed for children aged 2 to 5, spark curiosity, nurture creativity,
          and inspire a love for learning.
          <br /><br />
          At <strong>Young Eagles</strong>, we believe in joyful beginnings through play-based learning,
          imaginative exploration, and early exposure to exciting subjects like robotics and coding.
        </p>
      </header>

      <section className="mb-12">
        <h2
          className="text-3xl font-semibold text-center mb-12 text-indigo-800"
          data-aos="fade-up"
        >
          🧠 Play, Build, Code, Create: Explore Our Unique Learning Zones
        </h2>

        <div className="space-y-20">

          {/* Mini Coders */}
          <div
            className="w-full px-4 md:px-8 lg:px-16 xl:px-32 max-w-7xl mx-auto"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <img
                src={codeAPillar}
                alt="Code-a-pillar"
                className="md:w-[300px] h-auto rounded-lg shadow-lg"
              />
              <div className="bg-white rounded-xl p-6 shadow-lg text-left">
                <h3 className="text-xl font-bold mb-2 text-cyan-700">
                  🤖 Mini Coders & Robo Buddies (Ages 3–5)
                </h3>
                <p className="mb-3">
                  Children meet friendly robots like Bee-Bot and Code-a-pillar!
                  Through hands-on games and tablet play, kids learn how to give
                  simple commands, sequence movements, and problem-solve.
                </p>
                <ul className="list-disc list-inside mt-2 mb-5">
                  <li><strong>Age:</strong> 3–5 years</li>
                  <li><strong>Skills:</strong> Early logic, sequencing, motor skills</li>
                  <li><strong>Why it's fun:</strong> Kids love making robots move and dance!</li>
                </ul>
                <MyRegisterButton />
              </div>
            </div>
          </div>

          {/* Little Builders */}
          <div
            className="w-full px-4 md:px-8 lg:px-16 xl:px-32 max-w-7xl mx-auto"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <img
                src={legoBlocks}
                alt="Lego Blocks"
                className="md:w-[300px] h-auto rounded-lg shadow-lg"
              />
              <div className="bg-white rounded-xl p-6 shadow-lg text-left">
                <h3 className="text-xl font-bold mb-2 text-indigo-900">
                  🏗️ Little Builders & Tinkerers (Ages 2–5)
                </h3>
                <p className="mb-3">
                  With colorful blocks, gears, and shapes, children build towers,
                  bridges, and even pretend machines.
                </p>
                <ul className="list-disc list-inside mt-2 mb-5">
                  <li><strong>Age:</strong> 2–5 years</li>
                  <li><strong>Skills:</strong> Spatial awareness, creativity</li>
                  <li><strong>Why it's fun:</strong> Every block becomes an adventure!</li>
                </ul>
                <MyRegisterButton />
              </div>
            </div>
          </div>

          {/* Creative Cubs */}
          <div
            className="text-center bg-gradient-to-r from-cyan-500 to-sky-500 text-white p-6 rounded-lg shadow-xl"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <h3 className="text-xl font-bold mb-2">
              🎨 Creative Cubs Art Studio (Ages 2–5)
            </h3>
            <p>
              From finger painting to recycled crafts, little artists explore textures,
              colors, and materials while expressing themselves freely.
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 text-left inline-block">
              <li><strong>Skills:</strong> Creativity, sensory exploration</li>
              <li><strong>Why it's fun:</strong> Imagination runs wild with no rules!</li>
            </ul>
          </div>

          {/* Imagination Station */}
          <div
            className="text-center bg-gradient-to-r from-rose-500 to-red-500 p-6 rounded-lg shadow-xl text-white"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <h3 className="text-xl font-bold mb-2">
              📚 Imagination Station (Ages 2–5)
            </h3>
            <p>
              Storytime becomes showtime! With puppets, dress-up play, and group
              games, kids build language skills and explore feelings in a fun way.
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 text-left inline-block">
              <li><strong>Skills:</strong> Language, empathy, social skills</li>
              <li><strong>Why it's fun:</strong> Kids become the heroes of their own stories.</li>
            </ul>
          </div>
        </div>
      </section>

      <section
        className="text-center bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-lg shadow-lg mt-12 text-white"
        data-aos="zoom-in"
        data-aos-delay="500"
      >
        <h2 className="text-2xl font-semibold mb-4">🌈 Our Environment</h2>
        <p className="max-w-3xl mx-auto">
          Our center is a colorful, inclusive, and loving space where every child is celebrated.
          We proudly reflect our African heritage in toys, books, and role models—making sure
          children see brown-skinned faces and diverse stories that they relate to.
        </p>
      </section>

      {/* Mobile App Download Section */}
      <section
        className="mt-12"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <h2 className="text-3xl font-semibold text-center mb-8 text-purple-800">
          📱 Download Our Mobile App
        </h2>
        <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
          Get the Young Eagles mobile app for the best experience! Access homework, 
          track your child's progress, and stay connected with teachers.
        </p>
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaMobile className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Young Eagles PWA App
            </h3>
            <p className="text-gray-600 mb-6">
              Access our Progressive Web App for the best mobile experience. 
              View homework, track progress, and stay connected!
            </p>
            <Link
              to="/download"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              <FaDownload className="mr-2" />
              Get the App
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
