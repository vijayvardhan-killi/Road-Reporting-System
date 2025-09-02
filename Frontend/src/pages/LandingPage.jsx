import Hero from "@/components/Hero";
import React from 'react'
import { AuthContext } from "@/context/auth/authcontext";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
const LandingPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <HowItWorks></HowItWorks>
      <Features></Features>
      <Footer></Footer>
    </div>
  )
}

export default LandingPage
