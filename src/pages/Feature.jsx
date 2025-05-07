import React from 'react';
import photos1 from "../assets/photos/Feature1.jpg";
import photos2 from "../assets/photos/Feature2.jpg";
import photos3 from "../assets/photos/Feature3.jpg";
import photos4 from "../assets/photos/Feature4.jpg";

const Features = () => {
  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-gray-900 to-black mb-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Features</h1>
            <p className="text-lg leading-relaxed">
              SpendWise offers a comprehensive suite of tools to help you track expenses,
              manage budgets, and collaborate with others - all in one powerful platform.
            </p>
            <button className="mt-8 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Interactive Dashboard</h2>
          <div className="w-24 h-1 bg-black mx-auto mt-4 mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Get a complete overview of your finances with our powerful yet intuitive dashboard
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/5 mb-12 md:mb-0">
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-black rounded-full p-1 mr-4 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Comprehensive Overview</h3>
                  <p className="text-gray-700">View total expenses, incomes, budget status, and wallet balances at a glance</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-black rounded-full p-1 mr-4 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Visual Insights</h3>
                  <p className="text-gray-700">Analyze your spending patterns with intuitive pie charts and trend graphs</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-black rounded-full p-1 mr-4 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Customizable Widgets</h3>
                  <p className="text-gray-700">Arrange your dashboard to focus on what matters most to you</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
              <img 
                src={photos1}
                alt="Interactive financial dashboard" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wallet Management Section */}
      <div className="bg-gray-50 py-24 mb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Intelligent Wallet Management</h2>
            <div className="w-24 h-1 bg-black mx-auto mt-4 mb-8"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Organize your finances with multiple wallets for different purposes
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center justify-between">
            <div className="md:w-2/5 mb-12 md:mb-0">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-4 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Multiple Wallets</h3>
                    <p className="text-gray-700">Create separate wallets for personal, household, travel, or any other financial need</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-4 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Detailed Transactions</h3>
                    <p className="text-gray-700">Record transactions with amount, category, date, and notes for complete tracking</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-4 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Advanced Filtering</h3>
                    <p className="text-gray-700">Find transactions quickly with filters by date range, category, or wallet</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
                <img 
                  src={photos2}
                  alt="Wallet management interface" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Budget Features */}
      <div className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Smart Budget Planning</h2>
          <div className="w-24 h-1 bg-black mx-auto mt-4 mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Take control of your spending with powerful budgeting tools
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/5 mb-12 md:mb-0">
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-black rounded-full p-1 mr-4 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Flexible Budget Setting</h3>
                  <p className="text-gray-700">Create monthly or custom budgets for specific spending categories</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-black rounded-full p-1 mr-4 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Visual Progress Tracking</h3>
                  <p className="text-gray-700">Monitor your budget adherence with clear visual indicators and progress bars</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-black rounded-full p-1 mr-4 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Smart Alerts</h3>
                  <p className="text-gray-700">Receive timely notifications when approaching or exceeding budget limits</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
              <img 
                src={photos3}
                alt="Budget planning and tracking interface" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Collaboration Section */}
      <div className="bg-gray-50 py-24 mb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Seamless Collaboration</h2>
            <div className="w-24 h-1 bg-black mx-auto mt-4 mb-8"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Share wallets with family members, roommates, or team members for joint financial management
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center justify-between">
            <div className="md:w-2/5 mb-12 md:mb-0">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-4 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Shared Wallets</h3>
                    <p className="text-gray-700">Invite others to collaborate on a shared wallet for joint expenses</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-4 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Permission Controls</h3>
                    <p className="text-gray-700">Set different access levels (owner, editor, viewer) to maintain appropriate control</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-black rounded-full p-1 mr-4 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Real-time Updates</h3>
                    <p className="text-gray-700">See changes instantly when collaborators add or modify transactions</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="w-full h-80 bg-gray-100 rounded-tl-[140px] shadow-lg relative overflow-hidden">
                <img 
                  src={photos4}
                  alt="Collaborative finance management" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover rounded-tl-[140px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Features Grid */}
      <div className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Advanced Features</h2>
          <div className="w-24 h-1 bg-black mx-auto mt-4 mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Powerful tools that take your financial management to the next level
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-tl-[140px] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Recurring Transactions</h3>
            <p className="text-gray-700">
              Set up automatic tracking for regular expenses like rent, subscriptions, or income sources
            </p>
          </div>
          
          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-tl-[140px] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Expense Reports</h3>
            <p className="text-gray-700">
              Generate detailed reports for specific time periods, categories, or wallets that you can export
            </p>
          </div>
          
          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-tl-[140px] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Custom Categories</h3>
            <p className="text-gray-700">
              Create and customize expense categories that match your unique financial needs
            </p>
          </div>
          
          {/* Feature Card 4 */}
          <div className="bg-white p-8 rounded-tl-[140px] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Multi-Currency Support</h3>
            <p className="text-gray-700">
              Track expenses in different currencies with automatic conversion to your primary currency
            </p>
          </div>
          
          {/* Feature Card 5 */}
          <div className="bg-white p-8 rounded-tl-[140px] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Receipt Scanning</h3>
            <p className="text-gray-700">
              Capture and attach photos of receipts to transactions for easy reference and documentation
            </p>
          </div>
          
          {/* Feature Card 6 */}
          <div className="bg-white p-8 rounded-tl-[140px] shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Data Security</h3>
            <p className="text-gray-700">
              Bank-level encryption and secure authentication to protect your sensitive financial information
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who have transformed their financial management with SpendWise
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition duration-300">
              Login
            </button>
            <button className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-black transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;