import About from "@/component/sections/About";
import Footer from "@/component/sections/Footer";
import Greetings from "@/component/sections/Greetings";
import Navbar from "@/component/sections/Navbar";
import Projects from "@/component/sections/Projects";
import Services from "@/component/sections/Services";
import './globals.css'
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import Contact from "@/component/sections/Contact";

export default function Home() {
  return (
    <GlobalStateProvider >
      <Navbar />
      <Contact />
      <Greetings />
      <About />
      <Projects />
      <Services />
      <Footer />
    </GlobalStateProvider>
  );
}
