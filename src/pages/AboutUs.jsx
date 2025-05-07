import React from 'react';
import photos1 from "../assets/photos/technologyphoto1.jpg";
import photos2 from "../assets/photos/technologyphoto2.jpg";
import photos3 from "../assets/photos/technologyphoto3.jpg";

const AboutUs = () => {
  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section - More modern with gradient */}
      <div className="relative h-80 bg-gradient-to-r from-gray-900 to-black mb-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">About Us</h1>
            <p className="text-lg leading-relaxed">
              SpendWise aims to solve these problems by offering a comprehensive and user-friendly 
              expense tracking platform. With a mobile-responsive UI and insightful dashboards, 
              users gain full visibility into their financial habits.
            </p>
            <button className="mt-8 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Main Heading - More minimal, modern styling */}
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold">Building the Future of Finance</h2>
        <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
      </div>

      {/* First Feature Section - More spacious, modern layout */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between mb-32">
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <h3 className="text-3xl font-bold mb-6">Crafting Intuitive Financial Experiences</h3>
          <p className="mb-8 text-gray-700 leading-relaxed">
            The application allows users to create and manage wallets, set budgets, 
            categorize expenses and incomes, and collaborate with others through shared wallets. 
            Our developers focus on creating seamless interactions that make financial 
            management second nature.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition duration-300">
            Explore Features
          </button>
        </div>
        <div className="md:w-1/2 relative">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
            <img 
              src={photos1} 
              alt="Developer working on financial interface" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Second Feature Section */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center justify-between mb-32">
        <div className="md:w-1/2 mb-12 md:mb-0 md:pl-12">
          <h3 className="text-3xl font-bold mb-6">Engineering Powerful Financial Insights</h3>
          <p className="mb-8 text-gray-700 leading-relaxed">
            With a mobile-responsive UI and insightful dashboards, users will gain full 
            visibility into their financial habits, helping them make informed decisions. 
            Our engineering team leverages cutting-edge visualization techniques to transform 
            complex financial data into actionable intelligence.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition duration-300">
            View Technology
          </button>
        </div>
        <div className="md:w-1/2 relative">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
            <img 
              src={photos2}
              alt="Data visualization dashboard" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Third Feature Section */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between mb-32">
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <h3 className="text-3xl font-bold mb-6">Pioneering Collaborative Finance</h3>
          <p className="mb-8 text-gray-700 leading-relaxed">
            SpendWise enables collaboration through shared wallets, allowing teams and 
            households to manage finances together. Our developers have created secure, 
            real-time synchronization systems that maintain data integrity while enabling 
            seamless multi-user experiences.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition duration-300">
            Learn About Sharing
          </button>
        </div>
        <div className="md:w-1/2 relative">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
            <img 
              src={photos3}
              alt="Collaborative finance tools" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Team Section - Modern heading */}
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold">Our Developers</h2>
        <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
      </div>

      {/* Team Cards - More modern styling */}
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-10 mb-32">
        <div className="group relative w-72 h-96 transition-all duration-300 hover:translate-y-[-8px]">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg overflow-hidden">
            <img 
              src="/api/placeholder/400/400" 
              alt="Brian Gathui" 
              className="w-full h-full object-cover rounded-tl-[140px] transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-black text-white py-3 px-6 font-medium">
            Brian Gathui
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-[140px] flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="font-bold mb-2">Scram Master</p>
              <p className="text-sm">Expert in secure financial data systems</p>
            </div>
          </div>
        </div>

        <div className="group relative w-72 h-96 transition-all duration-300 hover:translate-y-[-8px]">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg overflow-hidden">
            <img 
              src="/api/placeholder/400/400" 
              alt="Lewis Odero" 
              className="w-full h-full object-cover rounded-tl-[140px] transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-black text-white py-3 px-6 font-medium">
            Lewis Odero
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-[140px] flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="font-bold mb-2">Lead Full-Stack Engineer</p>
              <p className="text-sm">Full-stack engineer with 8+ years experience in fintech</p>
            </div>
          </div>
        </div>

        <div className="group relative w-72 h-96 transition-all duration-300 hover:translate-y-[-8px]">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg overflow-hidden">
            <img 
              src="/api/placeholder/400/400" 
              alt="Marion Nafula" 
              className="w-full h-full object-cover rounded-tl-[140px] transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-black text-white py-3 px-6 font-medium">
            Marion Nafula
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-[140px] flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="font-bold mb-2">Backend Architect</p>
              <p className="text-sm">Expert in secure financial data systems</p>
            </div>
          </div>
        </div>
        <div className="group relative w-72 h-96 transition-all duration-300 hover:translate-y-[-8px]">
          <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg overflow-hidden">
            <img 
              src="/api/placeholder/400/400" 
              alt="Michael Ogango" 
              className="w-full h-full object-cover rounded-tl-[140px] transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-black text-white py-3 px-6 font-medium">
            Michael Ogango
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-[140px] flex items-center justify-center">
            <div className="text-white text-center p-4">
              <p className="font-bold mb-2">UI/UX Architect</p>
              <p className="text-sm">Specializes in creating intuitive financial interfaces</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why it works Section - More modern heading */}
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold">Our Approach</h2>
        <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
      </div>

      {/* Features Grid - More modern with hover effects */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
        <div className="text-center group">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-black group-hover:text-white transition duration-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Personalized Finance</h3>
          <p className="text-gray-700 leading-relaxed">
            Users manage finances at their own pace, with customizable categories,
            budgets, and interfaces that adapt to their unique financial style and goals.
          </p>
        </div>

        <div className="text-center group">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-black group-hover:text-white transition duration-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Secure Architecture</h3>
          <p className="text-gray-700 leading-relaxed">
            Built by security-focused developers, our platform employs 
            industry-leading encryption, authentication, and data protection 
            to safeguard your sensitive financial information.
          </p>
        </div>

        <div className="text-center group">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-black group-hover:text-white transition duration-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Powerful Analytics</h3>
          <p className="text-gray-700 leading-relaxed">
            Our developers have engineered advanced visualization tools that 
            transform complex financial data into clear insights, helping users 
            identify spending patterns and optimize their budgets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;