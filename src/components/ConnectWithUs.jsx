import { Mail, Phone, MapPin } from "lucide-react";

const ConnectWithUs = () => {
  return (
    <div className="w-full bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">Connect With Us</h2>
          <p className="text-muted-foreground">
            We are here to assist you with any questions or support you may
            need.
          </p>
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <div className="flex items-start space-x-4">
            <Mail className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Email</h4>
              <a
                href="mailto:hello@spendwise.com"
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                hello@spendwise.com
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Phone</h4>
              <a
                href="tel:+254701181197"
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                +254701181197
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Office</h4>
              <p className="text-muted-foreground">
                Westgate mall, Westlands, Nairobi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWithUs;
