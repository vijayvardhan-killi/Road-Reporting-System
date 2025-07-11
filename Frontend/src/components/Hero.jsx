import { AuthContext } from "@/context/auth/authcontext"

import { useContext } from "react"
const Hero = () => {
  const { loggedIn } = useContext(AuthContext);
  return (
    <div>
      <h1 className="text-4xl">Hero {`${loggedIn}`} log </h1>
    </div>
  )
}

export default Hero
