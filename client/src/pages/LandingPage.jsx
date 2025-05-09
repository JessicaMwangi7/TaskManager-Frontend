const LandingPage = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to TaskFlow</h1>
        <p className="text-lg text-gray-600 mb-8">
           Collaborate, manage, and track your team’s tasks in one simple platform.
        </p>
        <div className="flex gap-4">
          <a href="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">Get Started</a>
          <a href="/features" className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white">Learn More</a>
        </div>
      </div>
    );
  };
  
  export default LandingPage;
  