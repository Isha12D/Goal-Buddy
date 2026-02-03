import React, { useState, useEffect } from 'react';
import Login from '../Components/Login.jsx';
import Signup from '../Components/Signup.jsx';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';

const carouselData = [
  {
    img: 'https://i.pinimg.com/474x/eb/2d/ca/eb2dca2a0d66f9851e13cb1290f74d42.jpg',
    heading: 'Chat with your friends',
    text: 'Stay connected with your friends while setting and achieving your goals. Whether you’re brainstorming ideas or offering support, communication is key to your success.',
  },
  {
    img: 'https://i.pinimg.com/736x/1d/3e/34/1d3e340677f5250c72fd45958058f517.jpg',
    heading: 'Compete and Conquer your goals',
    text: 'Challenge yourself and your friends by setting ambitious goals. Compete in a friendly environment and experience the thrill of conquering milestones together.',
  },
  {
    img: 'https://i.pinimg.com/564x/06/aa/31/06aa31b2ceed430ac46d72cd3b9cdc73.jpg',
    heading: 'Celebrate points and rewards',
    text: 'Earn points and rewards as you accomplish your goals. Celebrate your achievements with friends, and stay motivated to keep going!',
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselData.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);

  const toggleLoginForm = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsSignupOpen(false);
  };

  const toggleSignupForm = () => {
    setIsSignupOpen(!isSignupOpen);
    setIsLoginOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar toggleLoginForm={toggleLoginForm} />

      {/* New Section */}
      <div className="flex flex-col md:flex-row items-center bg-black bg-opacity-60 ">
        {/* Left Column */}
        <div className="flex-1 text-white p-6 md:pr-8 ml-2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Set <span className="text-orange-500">Goal</span>,<br /> Compete,<br /> Achieve
          </h1>
          <p className="text-lg md:text-xl">
            Your journey to achieving greatness starts here.
          </p>
          <button className="mt-4 bg-white text-black rounded-full px-4 py-2 hover:bg-gray-200">
              Get Started
            </button>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex justify-center items-center mt-10 ml-3">
          <img
            src="https://i.pinimg.com/736x/cf/83/0a/cf830a32b1497ffcca49b5ba6d45703f.jpg"
            alt="Goal Setting"
            className="w-[90%] h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className=" bg-gray-900 bg-opacity-60 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carouselData.map((data, index) => (
            <div key={index} className="relative group">
              {/* Image */}
              <img
                src={data.img}
                alt={data.heading}
                className="w-full h-[300px] object-cover rounded-md shadow-lg transition-transform duration-300 group-hover:scale-105 opacity-70"
              />
              {/* Hover Text */}
              <div className="absolute bottom-0 left-0 w-full h-4/5 bg-black bg-opacity-60 text-white p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h2 className="text-xl font-bold mb-4">{data.heading}</h2>
                <p className="text-sm">{data.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2a0a31] text-white py-12 text-center">
        <h2 className="text-3xl md:text-4xl ">
          Ready to achieve your goals? Let's get started!
        </h2>
        <p className="text-lg md:text-xl mt-2 opacity-80">
          Connect, compete, and celebrate every milestone.
        </p>
        <button className="mt-6 px-6 py-3 bg-orange-500 text-black font-semibold rounded-full hover:bg-orange-600 transition">
          Get Started
        </button>
      </div>

      
      <Footer/>

      {/* Modals */}
      {isLoginOpen && <Login toggleLoginForm={toggleLoginForm} toggleSignupForm={toggleSignupForm} />}
      {isSignupOpen && <Signup toggleSignupForm={toggleSignupForm} />}
    </div>
  );
};

export default Home;
