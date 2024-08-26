import React from "react";
import { MdArrowOutward } from "react-icons/md";
import Image1 from "../../assets/Image/1.png";
import Image2 from "../../assets/Image/2.png";
import Image3 from "../../assets/Image/3.png";
const Feature = () => {
  return (
    <div className="bg-bg-prob2 h-auto">
      <div className="pt-16 p-4 mb-5 lg:text-center">
        <h1 className="font-Poppins text-[20px] font-bold text-prob-h mb-5 lg:text-[24px] text-center px-5">
          Adapt Smart Solutions for Better Healthcare
        </h1>
        <p className="font-Poppins text-[14px] text-paragraph lg:px-52 xl:px-[400px] text-center md:px-28">
          Our technology takes care of the details, so you can spend more time
          on what matters most—your patients.
        </p>
      </div>
      <div className="lg:flex lg:p-5">
        <div className="p-4">
          <div className="p-5 flex items-center justify-center">
            <img src={Image1} alt="" className="w-full md:w-1/2 lg:w-5/6" />
          </div>
          <div className="-mt-8 md:-mt-16 md:p-10 lg:-mt-11 lg:flex lg:flex-col lg:items-center xl:-mt-7">
            <h1 className="font-helvetica-bold text-[16px] md:text-[18px]  lg:text-center  ">
              Improve Diagnostic Accuracy
            </h1>
            <p className="font-Poppins text-[12px] pt-2 md:text-[14px] md:pr-10 lg:text-center lg:pr-0 xl:text-[16px]">
              Streamline your workflow with our software, enabling quick and
              precise identification of retinal conditions, which enhances
              patient outcomes and care quality.
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="p-5 flex items-center justify-center">
            <img src={Image2} alt="" className="w-full md:w-1/2 lg:w-5/6" />
          </div>
          <div className="md:p-10 lg:-mt-8 lg:flex lg:flex-col lg:items-center xl:-mt-2">
            <h1 className="font-helvetica-bold text-[16px] md:text-[18px]  lg:text-center  ">
              Streamline Patient Data Management
            </h1>
            <p className="font-Poppins text-[12px] pt-2 md:text-[14px] md:pr-10 lg:text-center lg:pr-0 xl:text-[16px]">
              Eyomn simplifies handling retinal images and patient records,
              enhancing data accuracy and accessibility while freeing up more
              time for patient care.
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="p-5  flex items-center justify-center">
            <img
              src={Image3}
              alt=""
              className="w-full h-full md:w-1/2 lg:w-5/6"
            />
          </div>
          <div className="md:p-10 lg:-mt-10 lg:flex lg:flex-col lg:items-center ">
            <h1 className="font-helvetica-bold text-[16px]  md:text-[18px] -top-10 lg:top-0 lg:text-center  ">
              Enhance Patient Care with Smart Technology
            </h1>
            <p className="font-Poppins text-[12px] pt-2 md:text-[14px] md:pr-10 lg:pr-0 lg:text-center xl:text-[16px]">
              By integrating advanced retinal analysis and efficient medical
              scribing, our platform boosts operational efficiency and supports
              better clinical decisions.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:p-14 xl:flex xl:flex-col">
        <div className=" md:border-none bg-white h-[50vh] flex flex-col justify-end pl-5 pr-2 lg:mb-4 lg:rounded-lg lg:h-[50vh] xl:h-[70vh] xl: w-full">
          <h1 className="font-Poppins text-[16px] md:text-[18px] text-prob-h font-bold pr-4">
            Enhance Patient Care with Smart Technology
          </h1>
          <p className="font-Poppins text-[12px] md:text-[14px] mb-3">
            By integrating advanced retinal analysis and efficient medical
            scribing, our platform boosts operational efficiency and supports
            better clinical decisions.
          </p>
          <div className="">
            <p className="font-Poppins text-[12px] md:text-[14px] mb-3  text-paragraph flex flex-row gap-1 underline cursor-pointer">
              Learn how this works
              <MdArrowOutward className="underline w-6 h-4 pt-1" />
            </p>
          </div>
        </div>
        <div className="lg:flex lg:flex-col lg:gap-4 xl:flex xl:flex-row xl:gap-4">
          <div className="border-2 border-solid  md:border-2 lg:border-none bg-white h-[50vh]  flex flex-col justify-end pl-5 pr-2 lg:rounded-lg lg:h-[25vh] xl:h-[40vh] xl:w-1/2">
            <h1 className="font-Poppins text-[16px] md:text-[18px] text-prob-h font-bold">
              Summarize Your Patient Notes
            </h1>
            <p className="font-Poppins text-[12px] md:text-[14px] mb-4">
              Retrieve patient notes in a structured summarized form.
            </p>
          </div>
          <div className="border-b-2  md:border-2 border-solid lg:border-none bg-white h-[50vh]  flex flex-col justify-end pl-5 pr-2 lg:rounded-lg lg:h-[25vh] xl:h-[40vh] xl:w-1/2">
            <h1 className="font-Poppins text-[16px] md:text-[18px] text-prob-h font-bold">
              Handle Patient Records Safely
            </h1>
            <p className="font-Poppins text-[12px] md:text-[14px] mb-4">
              Organize patient records safely and Intelligently
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
