import React from 'react'
import Navbar from '../Component/sections/Navbar'
import Introduction from './Landing Pages/Introduction'

import Feature from './Landing Pages/Feature'
import FAQ from './Landing Pages/FAQ'
import Contact from './Landing Pages/Contact'
import Footer from '../Component/sections/Footer'
const Landing = () => {
  return (
    <>
      <Navbar/>
      <div className='h-auto'>
        <Introduction />
        <Feature/>
        <FAQ/>
        <Contact/>
        <Footer/>
      </div>
    </>

  )
}

export default Landing