import React, { useState } from "react";
import Modal from "../../Component/ui/Modal";
import Form from "../../Component/ui/Form";
import AddUserToWaitlist from "../../Service/SpreadSheetService";
import { FcGoogle } from "react-icons/fc";
import SuccessModal from "../../Component/ui/SuccessModal";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Loader from "../../Component/ui/Loader";

const Introduction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const openErrorModal = () => setIsErrorModalOpen(true);
  const closeErrorModal = () => setIsErrorModalOpen(false);
  const formFields = [
    {
      name: "given_name",
      type: "text",
      placeholder: "Enter your First name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "family_name",
      type: "text",
      placeholder: "Enter your Last name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    { name: "email", type: "email", placeholder: "Enter your Email" },
  ];
  const handleSubmit = async (formData) => {
    closeModal();
    setIsLoading(true);
    try {
      const response = await AddUserToWaitlist(formData);
      if (response) {
        openSuccessModal();
      }
    } catch (error) {
      openErrorModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential;
      if (token) {
        const decodedToken = jwtDecode(token);
        const given_name = decodedToken.given_name;
        const family_name = decodedToken.family_name;
        const email = decodedToken.email;

        const data = {
          given_name: given_name,
          family_name: family_name,
          email: email,
        };

        const res = await AddUserToWaitlist(data);
        if (res) {
          openSuccessModal();
        }
      } else {
        console.error("Token is missing from the response.");
      }
    } catch (err) {
      openErrorModal();
      console.error("Error decoding token:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-[92vh] flex flex-col justify-center items-center p-4 bg-bg-prob2">
      {isLoading && <Loader />}
      <div className="-mt-20 flex flex-col items-center md:px-5">
        <h1 className="font-Raleway font-semibold text-center text-[1.5rem] md:px-28 md:text-[30px] lg:text-[45px] xl:px-0 leading-[1.2em] ">
          Set Your Clinic Apart with an AI-Powered Platform
        </h1>
        <p className="mt-2 lg:mt-5 text-[14px] lg:text-[18px] xl:text-[20px] text-center px-2 font-Poppins text-paragraph md:px-32">
          Get{" "}
          <span className="font-bold underline underline-offset-4 font-[#1ABC9C]">
            6 Months Free Access
          </span>{" "}
          if you Join our Waitlist Today!
        </p>
        <div
          className={`flex justify-center gap-2 items-center mt-8 border-2 border-solid border-[#1ABC9C] shadow-lg 
            h-12 w-auto  hover:cursor-pointer 
             bg-white hover:shadow-xl hover:scale-105
            font-Poppins font-bold
            transition-transform ease-in-out duration-300 animate-soundwave hover:animate-none `}
        >
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Login Failed");
            }}
            size="large"
            width={260}
          />
        </div>
        <div className="text-center mt-4">
          <p className="font-Poppins text-paragraph">Or</p>
          <p
            className="font-Poppins underline underline-offset-4 cursor-pointer text-paragraph"
            onClick={openModal}
          >
            Join with Email
          </p>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Join our Waitlist!"
          className="w-[600px] h-auto overflow-y-scroll p-4 pb-10"
          overlayClassName=""
          description={""}
        >
          <Form formFields={formFields} handleSubmit={handleSubmit} />
        </Modal>
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={closeSuccessModal}
          title={"You're on the Waitlist!"}
          description={
            "We appreciate your interest in our software and will notify you as soon as it’s available."
          }
        ></SuccessModal>
        <Modal
          isOpen={isErrorModalOpen}
          onClose={closeErrorModal}
          title="Joining Unavailable"
          className="w-[600px] h-auto p-4"
          overlayDescriptionClassName={
            "text-center font-Poppins pt-5 text-black text-[18px]"
          }
          description={"Email is already on the waitlist"}
        ></Modal>
      </div>
    </div>
  );
};

export default Introduction;
