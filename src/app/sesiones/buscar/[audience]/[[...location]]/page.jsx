import DynamicSesionesPage from '@/components/DynamicSesionesPage'
import Footer from '@/components/Footer'
import Navbar from '@/components/login/Navbar'
import React from 'react'

const page = () => {
  return (
    <div><Navbar/><DynamicSesionesPage/><Footer/></div>
  )
}

export default page