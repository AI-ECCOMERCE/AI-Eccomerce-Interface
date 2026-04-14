import HeroSection from "./components/HeroSection";
import HomeClient from "./components/HomeClient";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <HomeClient>
        <HeroSection />
      </HomeClient>
      <Footer />
    </>
  );
}
