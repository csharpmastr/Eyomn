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
      <div className='-mt-20 flex flex-col items-center'>
        <h1 className='text-[28px] lg:text-[50px] xl:text-[50px] font-Raleway tracking-normal text-center px-4  leading-8 md:px-24 md:text-[42px] md:leading-tight lg:px-24 xl:px-80'>
        Separate Your Clinic from the Rest with an AI-Powered Platform
        </h1>
        <p className='mt-2 text-[14px] lg:text-[18px] xl:text-[20px] text-center px-2 font-Poppins text-paragraph md:px-32 lg:px-60'>Get <span className='font-bold'>6 Months Free Access</span> if you Join our Waitlist Today!</p>
        <div 
          className={`flex justify-center gap-2 items-center mt-6 border-2 border-solid border-gray-400 shadow-lg h-12 w-3/4 px-2 md:w-1/3 lg:w-2/6 xl:w-1/6 hover:cursor-pointer hover:bg-gray-200`}
          onClick={openModal}>
          <p className=' flex items-center justify-center tracking-wide  text-gray-500  font-Poppins font-bold  transition-all ease-in-out duration-300'>Join Waitlist</p>
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
