import { Button } from "@/components/ui/button";

const SpendWiseHero = () => {
  return (
    <div className="w-full min-h-[80vh] bg-background text-foreground flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Section - Text Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Take Control of Your Finances
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Join us today and start tracking your expenses effortlessly with
              our free trial!
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button>Sign Up</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          {/* Right Section - Logo */}
          <div className="w-full md:w-1/2 flex items-center justify-center py-12">
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary">
                SW
              </h1>
              <p className="text-lg tracking-wide mt-2 text-muted-foreground">
                SPENDWISE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendWiseHero;
