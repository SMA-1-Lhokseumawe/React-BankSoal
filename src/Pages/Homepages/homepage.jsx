import React from "react";
import Navbar from "./Navbar/Navbar";
import NavbarBanner from "./Navbar/NavbarBanner";
import Hero from "./Hero/Hero";
import NumberCounter from "./NumberCounter/NumberCounter";
import Footer from "./Footer/Footer";
import "./homepage.css";

const Homepage = () => {
  return (
    <main className="overflow-x-hidden font-homepage">
      <Navbar />
      <NavbarBanner />
      <Hero />
      <NumberCounter />
      <Footer />
    </main>
  );
};

export default Homepage;
