import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import SpendWiseHero from "../components/SpendWiseHero";
import SpendWiseNewsletter from "../components/SpendWiseNewsletter";
import ConnectWithUs from "../components/ConnectWithUs";
import MapLayout from "../components/MapLayout";
import Feature from "../components/Feature";

const Home = () => {
  return (
    <>
      <Hero />
      <Feature />
      <Testimonial />
      <SpendWiseHero />
      <SpendWiseNewsletter />
      <ConnectWithUs />
      <MapLayout />
    </>
  );
};

export default Home;
