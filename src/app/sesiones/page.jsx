import SesionesPage from '@/components/SesionesPage'
import React from 'react'
import Navbar from '@/components/login/Navbar'
import Footer from '@/components/Footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <SesionesPage/>
      <Footer/>
      </div>

  )
}

export default page