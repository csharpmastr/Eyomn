import React, { useState } from 'react'
import Modal from '../../Component/ui/Modal'
import Form from '../../Component/ui/Form';




const Introduction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const formFields = [
    { name: 'name', type: 'text',  placeholder: 'Enter your name' },
    { name: 'email', type: 'email',  placeholder: 'Enter your email' }
  ];

  return (
    <div className='h-[92vh] flex flex-col justify-center items-center p-4 bg-bg-prob2'>
      <div className='-mt-20 flex flex-col items-center md:px-5'>
        <h1 className='font-Raleway font-semibold text-center text-[1.5rem] md:px-28 md:text-[30px] lg:text-[50px] xl:px-0 leading-[1.2em] '>
          Set Your Clinic Apart with an AI-Powered Platform
        </h1>
        <p className='mt-2 lg:mt-5 text-[14px] lg:text-[18px] xl:text-[20px] text-center px-2 font-Poppins text-paragraph md:px-32'>Get <span className='font-bold underline underline-offset-4'>6 Months Free Access</span> if you Join our Waitlist Today!</p>
        <div 
          className={`flex justify-center gap-2 items-center mt-8 border-2 border-solid border-gray-400 shadow-lg 
            h-12 w-3/4 px-2 md:w-1/3 lg:w-2/6 xl:w-[20vw] hover:cursor-pointer 
            hover:bg-gray-200 text-gray-500 hover:shadow-xl hover:scale-105
            font-Poppins font-bold
            transition-transform ease-in-out duration-300 animate-soundwave hover:animate-none `}
          onClick={openModal}>
          Join Waitlist
        </div>
      </div>
      <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Join on our Waitlist!"
            className="w-[600px] h-[500px]"
            overlayClassName=""
        >
            <Form formFields={formFields}/>
        </Modal>
    </div>
  )
}

export default Introduction
