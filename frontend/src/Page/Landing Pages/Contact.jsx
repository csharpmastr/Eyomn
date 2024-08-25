import React, { useState } from 'react';
import Modal from '../../Component/ui/Modal';
import Form from '../../Component/ui/Form';
import AddUserToWaitlist from '../../Service/SpreadSheetService';
import SuccessModal from '../../Component/ui/SuccessModal';

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const formFields = [
    { name: 'name', type: 'text', placeholder: 'Enter your name' },
    { name: 'email', type: 'email', placeholder: 'Enter your email' }
  ];

  const handleSubmit = async (formData) => {
    try {
      const response = await AddUserToWaitlist(formData);
      closeModal();
      openSuccessModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='xl:p-24 xl:bg-gradient-to-b xl:from-faq-bg xl:to-bg-prob2'>
      <div className='h-[70vh] md:h-[50vh] xl:h-[60vh] bg-contact-bg flex justify-center items-center xl:rounded-xl p-4'>
        <div className='xl:px-10 p-2 flex items-center flex-col justify-center'>
          <h1 className='text-[28px] lg:text-[50px] xl:text-[50px] font-helvetica-rounded text-white text-center leading-7'>
            Ready to <span className='text-appoint'>Accelerate</span> your clinic?
          </h1>
          <p className='text-center font-helvetica-rounded text-[14px] text-white lg:mt-12 mt-5'>
            We are launching beta test to a selected group of clinics
          </p>
          <div 
            className={`flex justify-center gap-2 items-center mt-6 border-2 border-solid border-gray-400 h-12 w-3/4 lg:w-1/3 shadow-lg hover:cursor-pointer hover:text-black hover:bg-white transition-all ease-in-out duration-300 hover:bg-opacity-50`}
            onClick={openModal}
          >
            <p className='flex items-center justify-center tracking-wide font-Poppins font-bold text-white'>
              Join Waitlist
            </p>
          </div>
        </div>
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Join on our Waitlist!"
            className="w-[600px] h-[500px]"
            overlayClassName=""
        >
            <Form formFields={formFields} handleSubmit={handleSubmit} />
        </Modal>
        <SuccessModal 
            isOpen={isSuccessModalOpen} 
            onClose={closeSuccessModal} 
            message="Submitted Successfully!" 
        />
      </div>
    </div>
  );
};

export default Contact;
