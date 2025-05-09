import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Feature() {
  return (
    <section className="py-16 bg-white text-primary">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Key Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Everything your team needs to collaborate, stay accountable, and get work done efficiently.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
              <img
                src="/images/features-photo1.jpg"
                alt="Task Management"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create, assign, update, and track tasks within projects and teams.
            </p>
            <Button variant="link" className="p-0 text-primary flex items-center gap-1">
              Learn More <ArrowRight size={16} />
            </Button>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
              <img
                src="/images/features-photo2.jpg"
                alt="Team Collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Real-time collaboration with notifications and shared boards.
            </p>
            <Button variant="link" className="p-0 text-primary flex items-center gap-1">
              Learn More <ArrowRight size={16} />
            </Button>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
              <img
                src="/images/features-photo3.jpg"
                alt="Accountability Tracking"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Accountability Tracking</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor progress, deadlines, and task completion across your team.
            </p>
            <Button variant="link" className="p-0 text-primary flex items-center gap-1">
              Learn More <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
