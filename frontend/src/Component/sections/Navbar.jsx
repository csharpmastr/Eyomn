import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, NavLink } from 'react-router-dom';
import EyomnLogo from '../../assets/Image/eyomn-logo.png'
const Navbar = () => {
  return (
    <header className='sticky top-0 z-50 bg-bg-prob2 overflow-hidden'>
        <nav className='w-[85vw] h-[10vh] md:h-[8vh] md:w-[87vw] lg:w-[75vw] mt-0 flex flex-row justify-center items-center sticky mx-auto'>
            <div className='flex justify-center items-center'>
              <img src={EyomnLogo} alt="Eyomn"  className='h-20 mt-1 hover:cursor-pointer' />
            </div>
        </nav>
    </header>
  )
}

export default Navbar
