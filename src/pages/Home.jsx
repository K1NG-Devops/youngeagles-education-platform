import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TracksuitPromo from '../components/Parents/TracksuitPromo';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const kidsImage = "https://img.freepik.com/free-photo/realistic-scene-with-young-children-with-autism-playing_23-2151241999.jpg";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <>
      <div className="mt-16 p-4 md:p-6 bg-pink-50 min-h-screen space-y-8 md:space-y-16 w-full overflow-x-hidden">
        {/* Hero */}
        <header className="text-center mb-8" data-aos="fade-down">
          <div className="flex flex-col md:flex-row items-center justify-center text-center overflow-x-hidden text-pink-700 font-bold">
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


          <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
            Where learning meets love. We nurture little minds with big dreams through play, care, and creativity.
          </p>
        </header>

        <div className="flex justify-center mb-10 overflow-hidden" data-aos="zoom-in">
  <img
    src={kidsImage}
    alt="Happy children playing"
    className="rounded-3xl shadow-xl w-[90%] md:w-[70%] md:h-[400px] sm:h-[400px] object-cover transition-transform hover:scale-105 max-w-full"
  />
</div>

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


        {/* Tracksuit Promo */}
        <section className="bg-white p-8 rounded-xl shadow-lg border" data-aos="fade-up">
          <TracksuitPromo />
        </section>

        {/* Gallery */}
        <section className="bg-pink-100 p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-pink-800 mb-6">Gallery Moments</h2>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1.5}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 2000, reverseDirection: true }}
            dir="rtl"
            className="w-full max-w-6xl"
          >
            {["/gallery/img1.jpg", "/gallery/img2.jpg", "/gallery/img3.jpeg", "/gallery/img4.png"].map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="md:h-100 h-50 w-full object-cover rounded-xl transition-transform hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                  data-aos-duration="500"
                  data-aos-easing="ease-in-out"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>



        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-xl shadow-lg" data-aos="zoom-in">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Join Our Family?</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Give your child the best start in life. Secure your spot for 2026 today!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              to="/register-2026"
              className="inline-block px-8 py-4 bg-white text-purple-600 text-lg font-bold rounded-full shadow-md hover:bg-gray-50 transition transform hover:scale-105 duration-300 ease-in-out"
            >
              🎯 Register for 2026
            </Link>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-yellow-400 text-gray-800 text-lg font-bold rounded-full shadow-md hover:bg-yellow-300 transition transform hover:scale-105 duration-300 ease-in-out"
            >
              📞 Schedule a Visit
            </Link>
            <Link
              to="/download"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-400 transition transform hover:scale-105 duration-300 ease-in-out"
            >
              <FaDownload className="mr-2" />
              📱 Get Our App
            </Link>
          </div>
          <p className="text-purple-200 text-sm mt-4">
            💎 Current families can access the parent portal through our mobile app
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
