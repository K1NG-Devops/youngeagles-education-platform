import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaGraduationCap, FaHeart, FaRocket, FaShieldAlt, FaMobile, FaBolt, FaWifi, FaBell, FaDownload } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import AdManager from '../components/AdManager';
import MarketingCTA from '../components/MarketingCTA';
import DatabaseService from '../services/DatabaseService';
import ErrorBoundary from '../components/ErrorBoundary';
import { toast } from 'sonner';

const kidsImage = "https://img.freepik.com/free-photo/realistic-scene-with-young-children-with-autism-playing_23-2151241999.jpg";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const features = [
    {
      icon: FaGraduationCap,
      title: "Society 5.0 Learning",
      description: "Integrating AI, IoT, and digital tools for future-ready education",
      color: "text-blue-600"
    },
    {
      icon: FaUsers,
      title: "Expert Caregivers",
      description: "Certified educators with years of experience in child development",
      color: "text-green-600"
    },
    {
      icon: FaShieldAlt,
      title: "Safe Environment",
      description: "Secure, clean, and nurturing spaces designed for children",
      color: "text-purple-600"
    },
    {
      icon: FaHeart,
      title: "Loving Care",
      description: "Personalized attention and emotional support for every child",
      color: "text-red-600"
    }
  ];

  const stats = [
    { number: 200, label: "Happy Children", icon: FaUsers },
    { number: 15, label: "Years Experience", icon: FaStar },
    { number: 10, label: "Expert Staff", icon: FaGraduationCap },
    { number: 98, label: "Parent Satisfaction", icon: FaHeart, suffix: "%" }
  ];

  return (
    <>
      <div className="mt-16 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 min-h-screen w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-center text-center text-pink-700 font-bold mb-8" data-aos="fade-down">
              <div data-aos="fade-right" data-aos-delay="200" className="text-xl md:text-5xl">
                Welcome to
              </div>
              <div data-aos="fade-down" data-aos-delay="400" className="md:ml-4 text-base md:text-5xl text-pink-800">
                Young Eagles
              </div>
              <div className="md:ml-4 text-xl md:text-5xl" data-aos="fade-left" data-aos-delay="600">
                Day Care
              </div>
            </div>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="800">
              Where learning meets love. We nurture little minds with big dreams through play, care, and creativity with cutting-edge Society 5.0 integration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12" data-aos="fade-up" data-aos-delay="1000">
              <Link 
                to="/register" 
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Enroll Your Child
              </Link>
              <Link 
                to="/programs" 
                className="border-2 border-pink-600 hover:bg-pink-600 hover:text-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                View Programs
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center mb-16" data-aos="zoom-in" data-aos-delay="600">
            <img
              src={kidsImage}
              alt="Happy children playing and learning at Young Eagles Daycare"
              className="rounded-2xl shadow-2xl max-w-4xl w-full h-auto"
              loading="eager"
            />
          </div>
        </section>

        {/* Ad Banner */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <ErrorBoundary fallbackMessage="Educational banner temporarily unavailable">
              <AdManager 
                placement="header"
                className="educational-banner"
              />
            </ErrorBoundary>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
              Trusted by Families Everywhere
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 200}>
                    <IconComponent className="text-4xl text-pink-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900">
                      <CountUp end={stat.number} duration={2.5} />
                      {stat.suffix || ''}
                      {!stat.suffix && stat.number > 50 ? '+' : ''}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Young Eagles?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine traditional nurturing care with innovative Society 5.0 technology to prepare your child for the future.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay={index * 200}>
                    <IconComponent className={`text-4xl ${feature.color} mx-auto mb-4`} />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AdSense Display Ad */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <ErrorBoundary fallbackMessage="Advertisement temporarily unavailable">
              <AdManager 
                placement="content"
                className="my-8"
                style={{ display: 'block', width: '100%', minHeight: '250px' }}
              />
            </ErrorBoundary>
          </div>
        </section>

        {/* Society 5.0 Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Society 5.0 Integration
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We're pioneering the future of early childhood education by integrating Society 5.0 principles - 
                  using AI, IoT, and digital tools to create personalized, engaging learning experiences.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaRocket className="text-blue-600 text-xl mr-3" />
                    <span className="text-gray-700">AI-powered learning assessments</span>
                  </div>
                  <div className="flex items-center">
                    <FaRocket className="text-green-600 text-xl mr-3" />
                    <span className="text-gray-700">Interactive digital learning tools</span>
                  </div>
                  <div className="flex items-center">
                    <FaRocket className="text-purple-600 text-xl mr-3" />
                    <span className="text-gray-700">Real-time parent communication</span>
                  </div>
                </div>
              </div>
              <div data-aos="fade-left">
                <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <FaRocket className="text-6xl mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Future-Ready Learning</h3>
                  <p className="text-lg opacity-90">
                    Preparing your child for tomorrow's world with today's most advanced educational technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Section */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="container mx-auto">
            <ErrorBoundary fallbackMessage="Advertisements temporarily unavailable">
              <div className="grid md:grid-cols-3 gap-6">
                <AdManager placement="sidebar" />
                <AdManager placement="content" />
                <AdManager placement="footer" />
              </div>
            </ErrorBoundary>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="text-center mb-12" data-aos="fade-up transform hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-3xl font-semibold text-purple-700 animate-bounce" data-aos="zoom-in">Why Choose Us?</h2><div className="animate-bounce text-pink-400 text-4xl mt-2">💖</div>
          <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md w-full">
            At Young Eagles, your child's happiness, safety, and development come first. Our professional staff fosters creativity, communication, and curiosity in a safe and playful environment.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12" data-aos="fade-up">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-up" data-aos-delay="0">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Play-Based Learning</h3>
            <p className="text-gray-600">Fun, engaging activities that support emotional and cognitive growth.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-xl font-bold text-green-600 mb-2">Safe Environment</h3>
            <p className="text-gray-600">Secure and clean facilities that give you peace of mind.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-xl font-bold text-pink-600 mb-2">Experienced Teachers</h3>
            <p className="text-gray-600">Loving educators who support each child's unique journey.</p>
          </div>
        </div>

        {/* Society 5.0 */}
        <section className="shadow-lg rounded-lg bg-white p-8" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">Introducing Society 5.0</h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
            Society 5.0 is a human-centered society that balances economic advancement with solving social problems through deep integration of cyberspace and the physical world.
          </p>
        </section>

        {/* Online Learning */}
        <section className="bg-blue-50 p-8 rounded-xl shadow-md" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Empowering Digital Natives</h2>
          <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
            Young Eagles introduces coding, robotics, and computer literacy to kids using fun tools like <strong>ScratchJr</strong>, <strong>Blockly</strong>, and hands-on STEM kits.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register-2026"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transform hover:scale-105 transition duration-300 ease-in-out font-semibold"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              📚 Register for 2026
            </Link>
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transform hover:scale-105 transition duration-300 ease-in-out"
              data-aos="fade-right"
              data-aos-delay="250"
            >
              💬 Contact Us
            </Link>
          </div>
        </section>

        {/* Aftercare */}
        <section className="bg-yellow-50 p-8 rounded-xl shadow-md" data-aos="fade-up">
          <h2
            className="text-3xl font-bold text-center text-yellow-700 mb-4"
            data-aos="fade-right"
            data-aos-delay="350"
          >
            Aftercare & Robotics
          </h2>
          <div className="text-center text-gray-700 mb-6 max-w-3xl mx-auto" data-aos="fade-left" data-aos-delay="350">
            <p data-aos="fade-left" data-aos-delay="400" className="mb-4">
              Our aftercare program offers a safe, engaging space for kids to unwind and explore.
              With activities like arts and crafts, outdoor play, and interactive learning, we ensure every child feels at home.
            </p>
            <p>
              For curious minds beyond preschool, our <strong>aftercare robotics program</strong> continues nurturing innovation through tech-based activities.
            </p>
          </div>
          <div className="flex justify-center">
            <a
              href="https://roboworld.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            >
              Visit RoboWorld
            </a>
          </div>
        </section>


        {/* Testimonials & Gallery Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
              See What Parents Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 shadow-lg" data-aos="fade-right">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Young Eagles has transformed my child's learning experience. The dedicated teachers and innovative programs create such a nurturing environment. My daughter comes home excited about what she learned every day!"
                </p>
                <div className="font-bold text-gray-900">- Phindile Lethlake</div>
                <div className="text-gray-600 text-sm">Parent at Young Eagles</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 shadow-lg" data-aos="fade-left">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The caring staff at Young Eagles go above and beyond for our children. The STEM programs and creative activities have helped my son develop confidence and a love for learning. Highly recommended!"
                </p>
                <div className="font-bold text-gray-900">- Minah Mawasha</div>
                <div className="text-gray-600 text-sm">Parent at Young Eagles</div>
              </div>
            </div>

            {/* Enhanced Gallery Carousel */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg border border-purple-100 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-3xl opacity-30">📸</div>
              <div className="absolute bottom-4 left-4 text-2xl opacity-30">🌟</div>
              <div className="absolute top-1/2 left-8 text-xl opacity-20">🎨</div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  📷 Gallery Moments
                </h3>
                <p className="text-center text-gray-600 mb-8">
                  Capturing joy, learning, and magical moments every day
                </p>

                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 3 }
                  }}
                  centeredSlides={true}
                  loop={true}
                  autoplay={{ 
                    delay: 3000, 
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                  }}
                  className="w-full max-w-6xl gallery-swiper"
                >
                  {[
                    { src: "/gallery/img1.jpg", caption: "Creative Art Time", emoji: "🎨" },
                    { src: "/gallery/img2.jpg", caption: "Learning Together", emoji: "📚" },
                    { src: "/gallery/img3.jpeg", caption: "Outdoor Adventures", emoji: "🌳" },
                    { src: "/gallery/img4.png", caption: "STEM Discovery", emoji: "🔬" },
                    { src: "/gallery/img1.jpg", caption: "Music & Movement", emoji: "🎵" },
                    { src: "/gallery/img2.jpg", caption: "Friendship Building", emoji: "🤝" }
                  ].map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative group cursor-pointer">
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                          <img
                            src={item.src}
                            alt={`${item.caption} - Children at Young Eagles`}
                            className="h-64 md:h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 text-white">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="font-semibold">{item.caption}</span>
                              </div>
                              <div className="text-sm opacity-90">Young Eagles Memories</div>
                            </div>
                          </div>

                          {/* Corner decoration */}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-lg">{item.emoji}</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Gallery stats */}
                <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-purple-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-gray-600">Happy Moments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">Daily</div>
                    <div className="text-sm text-gray-600">New Memories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">Pure Joy</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 p-12 rounded-xl shadow-lg" data-aos="zoom-in">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Join Our Family?</h3>
              <p className="text-purple-100 mb-8 max-w-2xl mx-auto text-lg">
                Give your child the best start in life with our innovative Society 5.0 education approach. Secure your spot today!
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-white text-purple-600 text-lg font-bold rounded-full shadow-md hover:bg-gray-50 transition transform hover:scale-105 duration-300"
                >
                  🎯 Enroll Now
                </Link>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-4 bg-yellow-400 text-gray-800 text-lg font-bold rounded-full shadow-md hover:bg-yellow-300 transition transform hover:scale-105 duration-300"
                >
                  📞 Schedule a Tour
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
