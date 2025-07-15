import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <div className="young">
      <h1 className="text">Welcome To Young Eagles Home Care Centre</h1>
      
      <div className="young1">
        <h2 className="text2">" Revolutionizing Education, Empowering Young Minds "</h2>
      </div>

      <div className="test">
        <button
          onClick={handleGetStarted}
          type="button"
          className="text-slate-900 bg-transparent hover:bg-pink-600 hover:text-black border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-m px-5 py-2.5 text-center inline items-center me-2 mb-2"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;

