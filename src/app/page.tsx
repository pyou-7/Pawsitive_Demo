import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import AppPreview from "@/components/landing/AppPreview";
import Services from "@/components/landing/Services";
import About from "@/components/landing/About";
import Values from "@/components/landing/Values";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-col w-full min-h-screen">
        <Hero />
        <AppPreview />
        <Services />
        <About />
        <Values />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
