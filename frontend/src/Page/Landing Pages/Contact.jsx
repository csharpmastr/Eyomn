import React, { useState } from "react";
import Modal from "../../Component/ui/Modal";
import Form from "../../Component/ui/Form";
import AddUserToWaitlist from "../../Service/SpreadSheetService";
import SuccessModal from "../../Component/ui/SuccessModal";
import Loader from "../../Component/ui/Loader";
const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const openErrorModal = () => setIsErrorModalOpen(true);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  const formFields = [
    {
      name: "first_name",
      type: "text",
      placeholder: "Enter your First name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "last_name",
      type: "text",
      placeholder: "Enter your Last name",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter your Email",
      pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    },
  ];

  const handleSubmit = async (formData) => {
    closeModal();
    setIsLoading(true);
    try {
      const response = await AddUserToWaitlist(formData);
      openSuccessModal();
    } catch (error) {
      openErrorModal();
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <div className="xl:p-24 xl:bg-gradient-to-b xl:from-faq-bg xl:to-bg-prob2">
      {isLoading && <Loader />}
      <div className="h-[70vh] md:h-[50vh] xl:h-[60vh] bg-contact-bg flex justify-center items-center xl:rounded-xl p-4">
        <div className="xl:px-10 p-2 flex items-center flex-col justify-center">
          <h1 className="text-[24px] md:text-[35px] lg:text-[50px] xl:text-[50px] font-helvetica-rounded text-white text-center leading-7">
            Ready to <span className=" text-[#1ABC9C]">Accelerate</span> your
            clinic?
          </h1>
          <p className="text-center font-helvetica-rounded text-[14px] text-white lg:mt-12 mt-5 px-4">
            We are launching beta test to a selected group of clinics
          </p>
          <div
            className={`flex justify-center gap-2 items-center mt-6 border-2 border-solid border-gray-400 h-12 w-3/4 lg:w-1/3 xl:w-[20vw] shadow-lg hover:cursor-pointer 
              transition-transform ease-in-out duration-300 
            hover:bg-gray-400 hover:bg-opacity-25
              hover:shadow-xl hover:scale-105 tracking-wide  text-white  font-Poppins font-bold  `}
            onClick={openModal}
          >
            Join Waitlist
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Join Waitlist!"
          className="w-[600px] h-auto p-4 pb-10"
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

export default Contact;
