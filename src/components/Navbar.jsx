import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseCircleFill } from "react-icons/ri";
// Using yehc_logo.png for the Young Eagles Home Care Centre branding
import useRedirect from "../hooks/useRedirect";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/home", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/popupload", label: "Upload POP", highlight: true },
];

const styles = {
  link: "text-blue-800 font-medium hover:text-white hover:bg-pink-500 px-4 py-2 rounded-full transition-all duration-500",
  highlight: "bg-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-pink-600 transition",
};

function Navbar() {
  const [IsMenuOpen, setIsMenuOpen] = useState(false);
  const redirect = useRedirect();

  const toggleMenu = () => setIsMenuOpen(!IsMenuOpen);

  const handleRedirect = (path) => {
    if (IsMenuOpen) toggleMenu();
    redirect(path, 2000);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-md backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 text-lg md:text-xl font-bold text-pink-600">
          <img src="/app-icons/yehc_logo.png" alt="Young Eagles Home Care Centre Logo" className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover shadow-sm" />
          <span className="hidden sm:inline">Young Eagles</span>
          <span className="sm:hidden">YE</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-4 ">
          {links.map((link, i) =>
            link.isRedirect ? (
              <li key={i} onClick={() => handleRedirect(link.to)} className="cursor-pointer">
                <span className={styles.link}>{link.label}</span>
              </li>
            ) : (
              <li key={i}>
                <Link
                  to={link.to}
                  className={link.highlight ? styles.highlight : styles.link}
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="relative z-[60] md:hidden bg-white p-2 rounded-full shadow-md cursor-pointer flex items-center justify-center w-10 h-10"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {IsMenuOpen ? (
            <RiCloseCircleFill className="text-pink-600 text-xl" />
          ) : (
            <GiHamburgerMenu className="text-pink-600 text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {IsMenuOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-[55]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu} // Close menu when clicking outside
            />

            {/* Slide-in Sidebar */}
            <motion.div
              className="fixed top-0 left-0 w-2/3 max-w-sm h-screen bg-white z-[60] shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent click propagation to the overlay
            >
              <ul className="flex flex-col gap-y-6 p-6 mt-10 text-center">
                {links.map((link, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (i + 1) }}
                    className="cursor-pointer w-full"
                    onClick={() =>
                      link.isRedirect
                        ? handleRedirect(link.to)
                        : toggleMenu()
                    }
                  >
                    {link.isRedirect ? (
                      <span className={styles.link}>{link.label}</span>
                    ) : (
                      <Link to={link.to} className={link.highlight ? styles.highlight : styles.link}>
                        {link.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
