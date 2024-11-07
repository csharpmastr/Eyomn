import React, { useRef, useEffect } from "react";

const Accordion = ({ index, isOpen, onClick, question, answer }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = React.useState("0px");

  useEffect(() => {
    setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
  }, [isOpen]);

  return (
    <div className="border-b border-white py-2 mb-5">
      <button onClick={onClick} className="flex justify-between w-full">
        <span className="text-white font-Poppins text-[14px] lg:text-[20px] text-left tracking-wide font-bold">
          {question}
        </span>
        <span
          className={`transition-transform duration-300 ease-in-out text-white font-bold ${
            isOpen ? "rotate-180 text-xl" : "rotate-0 text-xl"
          }`}
        >
          {isOpen ? "-" : "+"}
        </span>
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out mt-2"
        style={{ height }}
      >
        <p
          ref={contentRef}
          className={`ml-2 text-white text-[14px] lg:text-[16px] tracking-normal font-Poppins pb-2 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

export default Accordion;
