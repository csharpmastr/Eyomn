import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 250) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 md:bottom-10 md:right-10  bg-paragraph text-white p-3 rounded-full shadow-lg transition-all ease-in-out duration-300 hover:scale-105 "
          style={{ transition: "opacity 1s ease-in-out" }}
        >
          <FaArrowUp className="" />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
