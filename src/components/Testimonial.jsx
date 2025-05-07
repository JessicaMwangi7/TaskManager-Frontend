import { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import video1 from "../assets/videos/5438632-uhd_3840_2160_25fps.mp4";
import video2 from "../assets/videos/5438643-uhd_3840_2160_25fps.mp4";
import video3 from "../assets/videos/5977460-uhd_3840_2160_25fps.mp4";

const testimonials = [
  {
    video: video1,
    text: "SpendWise has transformed the way I manage my expenses. I now have complete control and clarity over my finances!",
    name: "Emily Johnson",
    role: "Finance Manager, ABC Corp",
    company: "Webflow",
  },
  {
    video: video2,
    text: "This app has helped me track my spending habits and make better financial decisions!",
    name: "John Doe",
    role: "Entrepreneur",
    company: "Startup Inc.",
  },
  {
    video: video3,
    text: "Using SpendWise has been a game-changer for me. Highly recommend it!",
    name: "Sarah Lee",
    role: "Freelancer",
    company: "Self-employed",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full bg-background text-foreground py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row bg-card rounded-lg overflow-hidden shadow-md border border-border">
          {/* Video Section */}
          <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto bg-primary flex items-center justify-center">
            <video className="w-full h-full" controls>
              <source src={currentTestimonial.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-12 w-12 absolute"
            >
              <Play className="h-5 w-5" />
              <span className="sr-only">Play video</span>
            </Button>
          </div>

          {/* Testimonial Content */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="flex text-primary">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <span key={i}>★</span>
                ))}
            </div>
            <p className="mt-4 text-lg font-medium">
              "{currentTestimonial.text}"
            </p>
            <p className="mt-6 font-semibold">{currentTestimonial.name}</p>
            <p className="text-muted-foreground">{currentTestimonial.role}</p>

            {/* Logo Placeholder */}
            <div className="mt-6 flex items-center">
              <div className="h-6 border-r border-border pr-4"></div>
              <span className="ml-4 text-lg font-semibold">
                {currentTestimonial.company}
              </span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex mt-8 gap-4">
              <Button
                onClick={prevTestimonial}
                size="icon"
                variant="outline"
                className="rounded-full h-10 w-10"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
              <Button
                onClick={nextTestimonial}
                size="icon"
                variant="outline"
                className="rounded-full h-10 w-10"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
