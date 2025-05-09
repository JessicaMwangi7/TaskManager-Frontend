import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8 text-primary">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-4xl">
              Collaborate, Track, and Stay Accountable with TaskFlow
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              TaskFlow empowers teams to manage tasks, collaborate in real-time,
              and stay accountable — all in one simple, powerful platform.
            </p>

            <p className="text-gray-600 text-sm md:text-base">
              Empower your team. Collaborate. Deliver on time. Achieve more together.
            </p>

            <div className="flex gap-4">
              <Button className="bg-primary text-white hover:bg-primary/90" size="lg">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                size="lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - updated */}
          <div className="flex items-center justify-center">
            <img
              src="/images/Homepage-photo.jpg"
              alt="TaskFlow Preview"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-2">Stay Updated!</h2>
          <p className="text-gray-600 mb-4">
            Join our newsletter for the latest tips and updates on managing your workflow effectively.
          </p>
          <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your Email Here"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <Button className="bg-primary text-white hover:bg-primary/90">
              Join Now
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            By clicking Join Now, you agree to our <a href="#" className="underline">Terms and Conditions</a>.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-2">Connect With Us</h2>
          <p className="text-gray-600 text-sm mb-4">Here to support and assist you.</p>
          <div className="flex flex-col items-center gap-1 text-sm">
            <p><strong>Email:</strong> hello@taskflow.com</p>
            <p><strong>Phone:</strong> +2540123456789</p>
          </div>
        </div>
      </div>
    </div>
  );
}
