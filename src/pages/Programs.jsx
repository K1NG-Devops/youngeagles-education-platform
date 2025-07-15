import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MyRegisterButton from "../components/MyRegisterButton";
import MyButton from "../components/MyButton";
import AdManager from "../components/AdManager";
import codeAPillar from "../assets/codeAPillar.png";
import legoBlocks from "../assets/legoBlocks.png";
import { FaRobot, FaTools, FaPalette, FaBook, FaGraduationCap, FaHeart, FaStar, FaChevronDown, FaPlay } from "react-icons/fa";

const Programs = () => {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const programs = [
    {
      id: 'mini-coders',
      title: '🤖 Mini Coders & Robo Buddies',
      ageRange: '3–5 years',
      icon: <FaRobot className="text-3xl text-cyan-500" />,
      image: codeAPillar,
      description: 'Children meet friendly robots like Bee-Bot and Code-a-pillar! Through hands-on games and tablet play, kids learn how to give simple commands, sequence movements, and problem-solve.',
      skills: ['Early logic', 'Sequencing', 'Motor skills', 'Problem solving'],
      highlight: 'Kids love making robots move and dance!',
      benefits: [
        'Develops computational thinking',
        'Builds confidence with technology',
        'Enhances logical reasoning',
        'Improves fine motor skills'
      ]
    },
    {
      id: 'little-builders',
      title: '🏗️ Little Builders & Tinkerers',
      ageRange: '2–5 years',
      icon: <FaTools className="text-3xl text-indigo-500" />,
      image: legoBlocks,
      description: 'With colorful blocks, gears, and shapes, children build towers, bridges, and even pretend machines.',
      skills: ['Spatial awareness', 'Creativity', 'Engineering basics', 'Planning'],
      highlight: 'Every block becomes an adventure!',
      benefits: [
        'Develops spatial intelligence',
        'Encourages creative thinking',
        'Builds persistence and patience',
        'Introduces STEM concepts'
      ]
    },
    {
      id: 'creative-cubs',
      title: '🎨 Creative Cubs Art Studio',
      ageRange: '2–5 years',
      icon: <FaPalette className="text-3xl text-rose-500" />,
      image: null,
      description: 'From finger painting to recycled crafts, little artists explore textures, colors, and materials while expressing themselves freely.',
      skills: ['Creativity', 'Sensory exploration', 'Fine motor skills', 'Self-expression'],
      highlight: 'Imagination runs wild with no rules!',
      benefits: [
        'Develops artistic abilities',
        'Enhances sensory development',
        'Builds self-confidence',
        'Encourages emotional expression'
      ]
    },
    {
      id: 'imagination-station',
      title: '📚 Imagination Station',
      ageRange: '2–5 years',
      icon: <FaBook className="text-3xl text-purple-500" />,
      image: null,
      description: 'Storytime becomes showtime! With puppets, dress-up play, and group games, kids build language skills and explore feelings in a fun way.',
      skills: ['Language development', 'Empathy', 'Social skills', 'Storytelling'],
      highlight: 'Kids become the heroes of their own stories!',
      benefits: [
        'Builds vocabulary and language skills',
        'Develops social emotional intelligence',
        'Encourages imaginative play',
        'Improves communication skills'
      ]
    }
  ];

  const programTabs = [
    { id: 'overview', label: 'Overview', icon: <FaGraduationCap /> },
    { id: 'benefits', label: 'Benefits', icon: <FaStar /> },
    { id: 'environment', label: 'Environment', icon: <FaHeart /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-24 pb-16 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            🌟 SmarTplay, Big Smiles
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Our Fun Learning Programs where every child's potential soars! 
            Discover joyful learning through play-based education, creativity, and early STEM exploration.
          </motion.p>
          
          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
          >
            {[
              { number: '4', label: 'Specialized Programs' },
              { number: '2-5', label: 'Age Range (Years)' },
              { number: '10', label: 'Expert Staff' },
              { number: '100%', label: 'Fun Guaranteed' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-purple-600">{stat.number}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Program Tabs */}
      <section className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
              {programTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Mobile Ad Banner */}
                <div className="md:hidden">
                  <AdManager placement="mobile" className="flex justify-center mb-6" />
                </div>

                {programs.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row items-center gap-8">
                        {program.image && (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex-shrink-0"
                          >
                            <img
                              src={program.image}
                              alt={program.title}
                              className="w-80 h-60 object-cover rounded-2xl shadow-lg"
                            />
                          </motion.div>
                        )}
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            {program.icon}
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800">{program.title}</h3>
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Ages {program.ageRange}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-lg leading-relaxed">
                            {program.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {program.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border-l-4 border-yellow-400">
                            <p className="text-yellow-800 font-medium">
                              ✨ {program.highlight}
                            </p>
                          </div>
                          
                          <div className="flex gap-4 pt-4">
                            <MyRegisterButton />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
                            >
                              <span>Learn More</span>
                              <motion.div
                                animate={{ rotate: expandedProgram === program.id ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <FaChevronDown />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedProgram === program.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8 pt-8 border-t border-purple-200"
                          >
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Program Benefits:</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {program.benefits.map((benefit, benefitIndex) => (
                                <motion.div
                                  key={benefitIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: benefitIndex * 0.1 }}
                                  className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                                >
                                  <FaStar className="text-green-500 flex-shrink-0" />
                                  <span className="text-gray-700">{benefit}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* In-feed Ad after second program */}
                    {index === 1 && (
                      <div className="py-8">
                        <AdManager placement="in-feed" className="flex justify-center" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'benefits' && (
              <motion.div
                key="benefits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Why Choose Our Programs?</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: '🧠', title: 'Cognitive Development', description: 'Enhancing critical thinking and problem-solving skills through interactive play' },
                    { icon: '🤝', title: 'Social Skills', description: 'Building confidence, empathy, and teamwork through collaborative activities' },
                    { icon: '🎯', title: 'Individual Growth', description: 'Personalized attention ensuring each child reaches their unique potential' },
                    { icon: '🌟', title: 'Creative Expression', description: 'Fostering imagination and artistic abilities in a supportive environment' },
                    { icon: '💡', title: 'STEM Foundation', description: 'Early introduction to science, technology, engineering, and math concepts' },
                    { icon: '❤️', title: 'Emotional Intelligence', description: 'Developing self-awareness and emotional regulation skills' }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg"
                    >
                      <div className="text-4xl mb-4">{benefit.icon}</div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'environment' && (
              <motion.div
                key="environment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">🌈 Our Learning Environment</h3>
                  <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                    Our center is a colorful, inclusive, and loving space where every child is celebrated.
                    We proudly reflect our African heritage in toys, books, and role models—making sure
                    children see brown-skinned faces and diverse stories that they relate to.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl shadow-lg"
                  >
                    <h4 className="text-2xl font-semibold text-gray-800 mb-4">🏡 Safe & Nurturing</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Child-proofed facilities</li>
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Trained and caring staff</li>
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> 24/7 security monitoring</li>
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Healthy meal programs</li>
                    </ul>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl shadow-lg"
                  >
                    <h4 className="text-2xl font-semibold text-gray-800 mb-4">🌍 Culturally Rich</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> African heritage celebration</li>
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Diverse books and materials</li>
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Multilingual environment</li>
                      <li className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Inclusive learning spaces</li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Child's Learning Journey?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join Young Eagles today and watch your child soar to new heights!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MyRegisterButton className="bg-white text-purple-600 hover:bg-gray-100" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                <FaPlay />
                <span>Watch Virtual Tour</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* AdSense Banner */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AdManager placement="content" className="flex justify-center" />
        </div>
      </section>
    </div>
  );
};

export default Programs;
