import React, { useEffect, useState } from "react";
import Accordion from "../../Component/ui/Accordion";
import AOS from "aos";
import "aos/dist/aos.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleAccordionClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const questionsAndAnswers = [
    {
      question: "When is the launch date of Eyomn?",
      answer: "Eyomn’s beta phase will be launched before November this year.",
    },
    {
      question: "Is Eyomn an EMR/EHR software?",
      answer:
        "Eyomn is more than just an EMR/EHR software. It is equipped with an AI capable of segmenting disease indicators (such as exudates, hemorrhage, and aneurysm) from Fundus Images. It can also summarize patient notes following the standards set by the healthcare community.",
    },
    {
      question: "Is Eyomn forever free?",
      answer:
        "Eyomn will charge a fee to cover legal and operational costs. For early adopters, they will get an additional 20% off discount for life once their free-trial ends. New users will pay the full amount after launch.",
    },
    {
      question: "How will I get access to Eyomn once launched?",
      answer:
        "An email with an access link will be sent to you immediately once launched.",
    },
  ];

  return (
    <div className="h-[auto] bg-faq-bg xl:pb-32 pb-24">
      <div className="flex flex-col lg:flex-row lg:justify-center items-center lg:pt-16">
        <div
          className="pt-20 lg:ml-10 lg:w-full flex self-start pl-5 lg:pl-10"
          data-aos="fade-right"
        >
          <h1 className="text-[24px] lg:text-[30px] font-Poppins font-bold text-white">
            Any question?<br></br> We got you.
          </h1>
        </div>
        <div className="pl-5 pr-5 mt-10 lg:mt-20 h-auto md:px-14 lg:px-24 xl:px-36">
          {questionsAndAnswers.map((item, index) => (
            <Accordion
              key={index}
              index={index}
              isOpen={index === openIndex}
              onClick={() => handleAccordionClick(index)}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
