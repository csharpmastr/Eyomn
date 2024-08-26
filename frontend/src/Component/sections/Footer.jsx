import React from 'react'
import Logo from '../../assets/Image/eyomn_logoS1-2-06.jpg'

import { FaFacebookSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className='h-auto'>
        <div className='pt-8 pb-5 lg:pb-10 lg:pt-10 lg'>
            <div className='md:flex md:flex-row  md:items-start md:justify-between mx-auto'>
                <div className='flex-shrink-0 pl-6 lg:pl-10'>
                    <img src={Logo} alt="Eyomn" className='h-24' />
                </div>
                <div className='flex gap-2 -mt-4 lg:gap-16 p-4 lg:pr-20 md:pr-5 pl-10 '>
                    <div className='flex flex-col w-1/2 md:w-auto lg:w-full text-left gap-2'>
                        <p className='font-Poppins text-[14px] text-paragraph mb-2'>Other</p>
                        <p className='font-Poppins hover:text-paragraph cursor-pointer'>Privacy policy</p>
                        <p className='font-Poppins hover:text-paragraph cursor-pointer'>Terms & Condition</p>
                    </div>
                    <div className='flex flex-col w-1/2 md:w-2/3 lg:w-auto gap-2 items-center'>
                        <p className='font-Poppins text-[14px] text-paragraph  mb-2'>Socials</p>
                        <a className='font-Poppins hover:text-paragraph cursor-pointer' href='https://www.facebook.com/profile.php?id=61564911541805' rel='noopener noreferrer' target='_blank'><FaFacebookSquare className='h-10 w-10 lg:h-12 lg:w-full'/></a>
                        <a className='font-Poppins hover:text-paragraph cursor-pointer'><AiFillInstagram className='h-10 w-10 lg:h-12 lg:w-full' /> </a>
                    </div>
                </div>
            </div>
            <div className='bg-span-bg w-3/4 h-[1px] mx-auto mt-5 mb-5'></div>
            <div className='md:pl-10 mb-10 pt-5'>
                <p className='text-center md:text-left font-Poppins text-[14px] md:text-[16px] lg:text-[18px]'>&copy; Eyomn AI, All rights reserve.</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer