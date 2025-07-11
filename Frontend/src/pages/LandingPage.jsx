import Hero from "@/components/Hero";
import React from 'react'
import { useContext } from "react";
import { AuthContext } from "@/context/auth/authcontext";

const LandingPage = () => {
  const {email , name} = useContext(AuthContext);
  return (
    <div>
      Landing page with 
      <p>user name : {name || "Not logged in"}</p>
      <p>emial : {email || "Not logged in"} </p>
      
      <Hero></Hero>
    </div>
  )
}

export default LandingPage
