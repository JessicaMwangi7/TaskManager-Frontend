import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SpendWiseNewsletter = () => {
  return (
    <div className="w-full bg-background text-foreground py-16 md:py-24">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Stay Updated with SpendWise
        </h2>
        <p className="mt-3 text-muted-foreground">
          Join our newsletter for the latest tips and updates on managing your
          finances effectively.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Input
            type="email"
            placeholder="Your Email Here"
            className="w-full"
          />
          <Button className="w-full sm:w-auto">Join Now</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          By clicking Join Now, you agree to our Terms and Conditions.
        </p>
      </div>
    </div>
  );
};

export default SpendWiseNewsletter;
