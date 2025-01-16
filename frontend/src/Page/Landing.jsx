import React from "react";
import Navbar from "../Component/sections/Navbar";
import Introduction from "./Landing Pages/Introduction";
import Feature from "./Landing Pages/Feature";
import FAQ from "./Landing Pages/FAQ";
import Contact from "./Landing Pages/Contact";
import Footer from "../Component/sections/Footer";
import BackToTop from "../Component/ui/BackToTop";

const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="h-auto">
        <Introduction />
        <Feature />
        <FAQ />
        <Contact />
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default Landing;
