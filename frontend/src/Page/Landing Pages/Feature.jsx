import React from 'react'
import { MdArrowOutward } from "react-icons/md";

const Feature = () => {
  return (
    <div className='bg-bg-prob2 h-auto pt-5'>
        <div className='pt-16 pl-5 pr-2 mb-5 lg:text-center'>
            <h1 className='font-Poppins text-[20px] font-bold text-prob-h mb-5  lg:text-[24px]'>Provide Care with Eyomn</h1>
            <p className='font-Poppins text-[14px] text-paragraph lg:px-52 xl:px-[400px] '>Lorem ipsum dolor sit amet consectetur. Ornare volutpat cursus sed torto dignissim suscipit facilisis volutpat cursOrn.</p>
        </div>
        <div className='lg:p-14 xl:flex xl:flex-col'>
            <div className=' md:border-none bg-white h-[50vh] flex flex-col justify-end pl-5 pr-2 lg:mb-4 lg:rounded-lg lg:h-[50vh] xl:h-[70vh] xl: w-full'>
                <h1 className='font-Poppins text-[16px] md:text-[18px] text-prob-h font-bold pr-4'>Analyze Fundus Images Easily with Eyomn</h1>
                <p className='font-Poppins text-[12px] md:text-[14px] mb-3'>
                    Lorem ipsum dolor sit amet consectetur. Ornare volutpat cursus sed torto dignissim suscipit
                </p>
                <div className=''>
                    <p className='font-Poppins text-[12px] md:text-[14px] mb-3  text-paragraph flex flex-row gap-1 underline cursor-pointer'>Learn how this works 
                        <MdArrowOutward className='underline w-6 h-4 pt-1'/> </p> 

                </div>
            </div>
            <div className='lg:flex lg:flex-col lg:gap-4 xl:flex xl:flex-row xl:gap-4'>
                <div className='border-2 border-solid  md:border-2 lg:border-none bg-white h-[50vh]  flex flex-col justify-end pl-5 pr-2 lg:rounded-lg lg:h-[25vh] xl:h-[40vh] xl:w-1/2'>
                    <h1 className='font-Poppins text-[16px] md:text-[18px] text-prob-h font-bold'>Summarize Your Patient Notes</h1>
                    <p className='font-Poppins text-[12px] md:text-[14px] mb-4'>
                        Retrieve patient notes in a structured summarized form.
                    </p>
                </div>
                <div className='border-b-2  md:border-2 border-solid lg:border-none bg-white h-[50vh]  flex flex-col justify-end pl-5 pr-2 lg:rounded-lg lg:h-[25vh] xl:h-[40vh] xl:w-1/2'>
                    <h1 className='font-Poppins text-[16px] md:text-[18px] text-prob-h font-bold'>Handle Patient Records Safely</h1>
                    <p className='font-Poppins text-[12px] md:text-[14px] mb-4'>
                        Organize patient records safely and Intelligently
                    </p>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Feature