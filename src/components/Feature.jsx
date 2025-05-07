import { Box, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import photos1 from "../assets/photos/ladies smiling.jpg";
import photos2 from "../assets/photos/housefund.jpg";
import photos3 from "../assets/photos/wallet.jpg";

export default function Feature() {
  return (
    <div className="w-full bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-24">
        {/* Features Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col justify-center space-y-4">
            <span className="text-sm font-medium text-muted-foreground">
              Features
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Discover Our Powerful Expense Management Tools
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              Take control of your finances with our intuitive features.
              SpendWise empowers you to categorize expenses, track income, and
              collaborate seamlessly.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="bg-primary p-3 inline-flex rounded-md">
                <Box className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">
              Simplify Your Budgeting with Expense Categorization
            </h2>
            <p className="text-muted-foreground">
              Organize your spending by easily categorizing each transaction.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="bg-primary p-3 inline-flex rounded-md">
                <Box className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">
              Stay on Top of Your Earnings
            </h2>
            <p className="text-muted-foreground">
              Track your income effortlessly to understand your financial
              health.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="bg-primary p-3 inline-flex rounded-md">
                <Box className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">
              Collaborate with Shared Wallets for Better Management
            </h2>
            <p className="text-muted-foreground">
              Share wallets with family or friends for collaborative budgeting.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-24">
          <Button variant="outline">Learn More</Button>
          <Button variant="outline" className="flex items-center gap-2">
            Sign Up
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Your Journey Section */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-muted-foreground">
            Track
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mt-2">
            Your Journey to Smart Expense Management
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
            With SpendWise, tracking your expenses is a breeze. Follow these
            simple steps to take control of your finances today.
          </p>
        </div>

        {/* Steps with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="mb-4 w-full aspect-video bg-muted rounded-md overflow-hidden">
              <img
                src={photos1}
                alt="Create account"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">
              Create Your SpendWise Account Easily
            </h3>
            <p className="text-muted-foreground text-center text-sm">
              Sign up for free and set up your profile.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="mb-4 w-full aspect-video bg-muted rounded-md overflow-hidden">
              <img
                src={photos2}
                alt="Set budgets"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">
              Set Budgets for Your Financial Goals
            </h3>
            <p className="text-muted-foreground text-center text-sm">
              Define your spending limits to stay on track.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="mb-4 w-full aspect-video bg-muted rounded-md overflow-hidden">
              <img
                src={photos3}
                alt="Categorize expenses"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">
              Categorize Your Income and Expenses
            </h3>
            <p className="text-muted-foreground text-center text-sm">
              Organize your transactions for better insights.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button>Get Started</Button>
          <Button variant="outline" className="flex items-center gap-2">
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Results
            </span>
            <h2 className="text-2xl font-bold mt-2 mb-4">
              Transform Your Financial Management with SpendWise
            </h2>
          </div>
          <div>
            <p className="text-muted-foreground">
              Join thousands of users who have streamlined their budgeting and
              expense tracking. Experience the power of informed financial
              decisions with SpendWise.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-12">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">75%</p>
            <p className="text-sm text-muted-foreground">
              of users report improved financial clarity and control
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">90%</p>
            <p className="text-sm text-muted-foreground">
              of users achieve their budgeting goals with our app
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline">Learn More</Button>
          <Button variant="outline" className="flex items-center gap-2">
            Sign Up
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
