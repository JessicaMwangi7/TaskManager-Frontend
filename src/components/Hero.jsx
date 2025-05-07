import { Button } from "@/components/ui/button";
import photos1 from "../assets/photos/20bob coin.jpg";
import photos2 from "../assets/photos/100bob handover.jpg";
import photos3 from "../assets/photos/Card Handling.jpg";
import photos4 from "../assets/photos/Coins drop.jpg";
import photos5 from "../assets/photos/Money flower pot.jpg";

export default function Hero() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 md:px-6 lg:px-8 text-primary">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ------Left Column --------- */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Take Control of Your Spending with SpendWise
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              SpendWise empowers you to effortlessly track your expenses and
              manage your budgets. With our intuitive platform, gain insights
              into your financial habits and make informed decisions for a
              brighter financial future.
            </p>
            <div className="flex gap-4">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
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
          {/* Right ------ - Image Grid---- */}
          <div className="grid grid-cols-8 grid-rows-6 gap-4">
            {/* Top  */}
            <div className="col-span-3 row-span-2">
              <img
              src={photos1}
                alt="Money jar"
                className="h-full w-full rounded-br-[140px] object-cover"
              />
            </div>
            <div className="col-span-5 row-span-2">
              <img
                src={photos2}
                alt="Coins spilling"
                className="h-full w-full rounded-bl-[140px] object-cover"
              />
            </div>
            {/* Bottom */}
            <div className="col-span-5 row-span-4">
              <img
                src={photos3}
                alt="Dollar bills"
                className="h-full w-full rounded-tr-[140px] object-cover"
              />
            </div>
            <div className="col-span-3 row-span-4 flex flex-col gap-4">
              <div className="h-1/2">
                <img
                  src={photos4}
                  alt="Credit card transaction"
                  className="h-full w-full rounded-bl-[140px] object-cover"
                />
              </div>
              <div className="h-1/2">
                <img
                  src={photos5}
                  alt="Money counting"
                  className="h-full w-full rounded-tl-[140px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
