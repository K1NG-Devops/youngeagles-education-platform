import React from 'react';
import { FaUsers, FaHeart, FaGraduationCap, FaShieldAlt, FaStar, FaRocket } from 'react-icons/fa';
import SEOManager from '../components/SEO/SEOManager';
import { EducationalBanner } from '../components/Ads/AdManager_Safe';

const About = () => {
  const values = [
    {
      icon: FaHeart,
      title: "Love & Care",
      description: "Every child receives personalized attention and nurturing care in a loving environment."
    },
    {
      icon: FaGraduationCap,
      title: "Excellence in Education",
      description: "We maintain the highest standards in early childhood education with innovative teaching methods."
    },
    {
      icon: FaShieldAlt,
      title: "Safety First",
      description: "Your child's safety and security is our top priority with modern safety protocols."
    },
    {
      icon: FaRocket,
      title: "Future Ready",
      description: "Preparing children for the future with Society 5.0 integration and modern learning tools."
    }
  ];

  const team = [
    {
      name: "Annatjie Makunyane",
      role: "Principal",
      experience: "15+ years",
      specialization: "Educational Leadership & Administration"
    },
    {
      name: "Seipati Kgalema",
      role: "Lead Teacher",
      experience: "10+ years",
      specialization: "Early Childhood Development"
    },
    {
      name: "Dimakatso Mogashoa",
      role: "Teacher",
      experience: "8+ years",
      specialization: "Creative Learning & Arts"
    },
    {
      name: "Marrion Makunyane",
      role: "Administrator",
      experience: "12+ years",
      specialization: "Student Records & Parent Relations"
    }
  ];

  return (
    <>
      <SEOManager 
        title="About Young Eagles Education Platform - Our Story & Mission"
        description="Learn about Young Eagles Education Platform's mission, values, and expert team dedicated to providing premium daycare and early learning with Society 5.0 integration."
        keywords="about young eagles, education platform story, daycare mission, early learning values, expert teachers"
        url="https://youngeagles.edu/about"
      />
      
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Young Eagles</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Pioneering the future of early childhood education through love, innovation, and excellence
            </p>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Founded in 2009, Young Eagles Education Platform began with a simple yet powerful vision: 
                  to create a nurturing environment where children can explore, learn, and grow while preparing 
                  for the challenges of tomorrow's world.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Today, we're proud to be at the forefront of early childhood education, integrating Society 5.0 
                  principles with traditional care values to provide an unparalleled learning experience for children 
                  aged 6 months to 6 years.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">200+</div>
                    <div className="text-gray-600">Happy Children</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">10+</div>
                    <div className="text-gray-600">Expert Staff</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://img.freepik.com/free-photo/realistic-scene-with-young-children-with-autism-playing_23-2151241999.jpg"
                  alt="Children learning and playing at Young Eagles"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do at Young Eagles
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                    <IconComponent className="text-4xl text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ad Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <EducationalBanner 
              title="Educational Excellence Partners"
              description="Discover the innovative educational tools and resources that enhance our curriculum"
              buttonText="Learn More"
            />
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dedicated professionals with years of experience in early childhood education
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-1">{member.experience} experience</p>
                  <p className="text-gray-600 text-sm">{member.specialization}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaRocket className="text-blue-600 mr-3" />
                  Our Mission
                </h3>
                <p className="text-gray-600 text-lg">
                  To provide exceptional early childhood education that nurtures each child's unique potential 
                  through innovative teaching methods, Society 5.0 integration, and unwavering commitment to 
                  safety, care, and educational excellence.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaStar className="text-yellow-500 mr-3" />
                  Our Vision
                </h3>
                <p className="text-gray-600 text-lg">
                  To be the leading early childhood education platform that shapes confident, creative, and 
                  capable future leaders who are prepared to thrive in an ever-evolving digital world while 
                  maintaining strong human values.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
