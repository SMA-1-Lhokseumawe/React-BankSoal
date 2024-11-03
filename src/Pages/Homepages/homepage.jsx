import React, { useState } from "react";
import "./homepage.css";
import logo2 from "../../assets/logo2.png";
import irvan from "../../assets/irvan.png";
import widia from "../../assets/widia.png";
import ari from "../../assets/ari.png";
import fannisa from "../../assets/fannisa.png";
import {
  BiCheckDouble,
  BiSolidBuildings,
  BiGroup,
  BiBookBookmark,
  BiLogoTwitter,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoGooglePlus,
  BiLogoLinkedin,
  BiCube,
} from "react-icons/bi";
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";

const Homepage = () => {
  const [counterOn, setCounterOn] = useState(false);
  return (
    <div>
      <div
        id="hero"
        className="flex flex-col justify-center items-center h-screen bg-gray-100"
      >
        <div
          className="container mx-auto text-center md:text-left"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to SMA 1 WATES
          </h1>
          <h2 className="text-xl font-semibold text-gray-600">
            "School of Science, Environment, Art and Technology"
          </h2>
          <a
            href="#about"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>

      <main id="main">
        {/* About Section */}
        <section id="about" className="about mt-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/4 mb-4 md:mb-0">
                <img
                  src={logo2}
                  className="img-fluid w-full h-auto"
                  alt="SMA 1 WATES Logo"
                />
              </div>
              <div className="w-full md:w-3/4 md:pl-4">
                <h3 className="text-2xl font-bold text-gray-800">About</h3>
                <p className="mt-4 text-gray-700">
                  SMA Negeri 1 Wates merupakan salah satu SMA yang sudah cukup
                  mempunyai nama besar, oleh karena itu SMA 1 Wates menjadi
                  sekolah favorit...
                </p>
                <ul className="mt-5 space-y-2">
                  <li className="flex items-center space-x-2">
                    <BiCheckDouble className="text-blue-600" />
                    <span>
                      "Excellence is not being the best, but it is doing your
                      best"
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BiCheckDouble className="text-blue-600" />
                    <span>
                      Keunggulan bukanlah yang terbaik, tetapi Keunggulan adalah
                      melakukan yang terbaik
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BiCheckDouble className="text-blue-600" />
                    <span>
                      Jalan Terbahsari Nomor 1, Terbah, Wates, Kulon Progo, D.I.
                      Yogyakarta 55651
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Counts Section */}
        <ScrollTrigger
          onEnter={() => setCounterOn(true)}
          onExit={() => setCounterOn(false)}
        >
          <section id="counts" className="counts bg-gray-100 py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="count-box text-center">
                  <BiGroup className="text-4xl text-blue-600 mx-auto" />
                  <span className="text-3xl font-bold text-gray-800">
                    {counterOn && (
                      <CountUp start={0} end={563} duration={2} delay={0} />
                    )}
                  </span>
                  <p className="mt-2 text-gray-600">Siswa</p>
                </div>
                <div className="count-box text-center">
                  <BiCube className="text-4xl text-blue-600 mx-auto" />
                  <span className="text-3xl font-bold text-gray-800">
                    {counterOn && (
                      <CountUp start={0} end={126} duration={2} delay={0} />
                    )}
                  </span>
                  <p className="mt-2 text-gray-600">Tenaga Pendidik</p>
                </div>
                <div className="count-box text-center">
                  <BiSolidBuildings className="text-4xl text-blue-600 mx-auto" />
                  <span className="text-3xl font-bold text-gray-800">
                    {counterOn && (
                      <CountUp start={0} end={227} duration={2} delay={0} />
                    )}
                  </span>
                  <p className="mt-2 text-gray-600">Fasilitas</p>
                </div>
                <div className="count-box text-center">
                  <BiBookBookmark className="text-4xl text-blue-600 mx-auto" />
                  <span className="text-3xl font-bold text-gray-800">
                    {counterOn && (
                      <CountUp start={0} end={22} duration={2} delay={0} />
                    )}
                  </span>
                  <p className="mt-2 text-gray-600">Ekstrakurikuler</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollTrigger>

        {/* Team Section */}
        <section id="team" className="team py-10">
          <div className="container mx-auto px-4">
            <div className="section-title text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Team</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="member text-center">
                <img
                  src={irvan}
                  alt="Irvan Nasyakban"
                  className="w-full h-auto rounded-lg mb-2"
                />
                <h4 className="font-semibold text-gray-800">Irvan Nasyakban</h4>
                <span className="text-gray-600">210180187</span>
              </div>
              <div className="member text-center">
                <img
                  src={widia}
                  alt="Widia Hamsi"
                  className="w-full h-auto rounded-lg mb-2"
                />
                <h4 className="font-semibold text-gray-800">Widia Hamsi</h4>
                <span className="text-gray-600">210180184</span>
              </div>
              <div className="member text-center">
                <img
                  src={ari}
                  alt="Muhammad Ariansyah"
                  className="w-full h-auto rounded-lg mb-2"
                />
                <h4 className="font-semibold text-gray-800">
                  Muhammad Ariansyah
                </h4>
                <span className="text-gray-600">210180197</span>
              </div>
              <div className="member text-center">
                <img
                  src={fannisa}
                  alt="Fannisa Nadira"
                  className="w-full h-auto rounded-lg mb-2"
                />
                <h4 className="font-semibold text-gray-800">Fannisa Nadira</h4>
                <span className="text-gray-600">210180156</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-gray-900 text-gray-300 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <div className="copyright">
              &copy; Copyright{" "}
              <strong>
                <span>SMA 1 WATES</span>
              </strong>
              . All Rights Reserved
            </div>
            <div className="credits">
              Designed by{" "}
              <a
                href="https://bootstrapmade.com/"
                className="text-blue-500 hover:underline"
              >
                Irvan Nasyakban
              </a>
            </div>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/dashboard" className="text-blue-500 hover:text-blue-700">
              <BiLogoTwitter className="w-6 h-6" />
            </a>
            <a href="/dashboard" className="text-blue-500 hover:text-blue-700">
              <BiLogoFacebook className="w-6 h-6" />
            </a>
            <a href="/dashboard" className="text-blue-500 hover:text-blue-700">
              <BiLogoInstagram className="w-6 h-6" />
            </a>
            <a href="/dashboard" className="text-blue-500 hover:text-blue-700">
              <BiLogoGooglePlus className="w-6 h-6" />
            </a>
            <a href="/dashboard" className="text-blue-500 hover:text-blue-700">
              <BiLogoLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
