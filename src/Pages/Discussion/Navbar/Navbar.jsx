import React from "react";
import LogoSMA from "../../../assets/logo2.png";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login"); // Navigate to the "/login" page
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="container flex justify-between items-center py-6">
          {/* Logo section */}
          <div className="text-2xl flex items-center gap-2 font-bold">
            <img src={LogoSMA} alt="SMA 1 Lhokseumawe" style={{width: "65px"}} />
            <p>SMA 1 Lhokseumawe</p>
          </div>

          {/* CTA Button section */}
          <div className="hidden lg:block space-x-6">
            <button className="text-white bg-secondary font-semibold rounded-full px-6 py-2" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
