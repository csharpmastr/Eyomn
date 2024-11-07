import React, { useState } from "react";
import Logo from "../../assets/Image/eyomn_logoS1-2-06.jpg";
import { MdAttachEmail } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import Modal from "../ui/Modal";
import Privacy from "./Privacy";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <footer className="h-auto">
      <div className="pt-8 pb-5 lg:pb-10 lg:pt-10 lg">
        <div className="md:flex md:flex-row  md:items-start md:justify-between mx-auto">
          <div className="flex-shrink-0 pl-6 lg:pl-10">
            <img src={Logo} alt="Eyomn" className="h-24" />
          </div>
          <div className="flex gap-2 -mt-4 lg:gap-16 p-4 lg:pr-20 md:pr-5 pl-10 ">
            <div className="flex flex-col w-1/2 md:w-auto lg:w-full text-left gap-2">
              <p className="font-Poppins text-[14px] text-paragraph mb-2">
                Other
              </p>
              <p
                className="font-Poppins hover:text-paragraph cursor-pointer"
                onClick={openModal}
              >
                Privacy policy
              </p>
              <p className="font-Poppins hover:text-paragraph cursor-pointer">
                Terms & Condition
              </p>
            </div>
            <div className="flex flex-col w-1/2 md:w-2/3 lg:w-auto gap-2 items-center">
              <p className="font-Poppins text-[14px] text-paragraph  mb-2">
                Socials
              </p>
              <a
                className="font-Poppins hover:text-paragraph cursor-pointer"
                href="https://www.facebook.com/profile.php?id=61564911541805"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaFacebookSquare className="h-10 w-10 lg:h-9" />
              </a>
              <a
                className="font-Poppins hover:text-paragraph cursor-pointer"
                href="mailto:info@eyomn.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <MdAttachEmail className="h-10 w-10 lg:h-9" />
              </a>
            </div>
          </div>
        </div>
        <div className="bg-span-bg w-3/4 h-[1px] mx-auto mt-5 mb-5"></div>
        <div className="md:pl-10 mb-10 pt-5">
          <p className="text-center md:text-left font-Poppins text-[14px]">
            &copy; Eyomn AI, All rights reserve.
          </p>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Privacy Policy"
          className="w-[600px] h-[500px] p-4 lg:pl-10"
          overlayDivDesc={"h-[390px] overflow-y-scroll"}
          overlayClassName=""
          description={<Privacy />}
        ></Modal>
      </div>
    </footer>
  );
};

export default Footer;
