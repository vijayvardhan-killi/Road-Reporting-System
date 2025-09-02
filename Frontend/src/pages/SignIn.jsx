import { LoginForm } from "@/components/SignInForm";
import { AuthContext } from "../context/auth/authcontext";
import { useEffect , useContext } from "react";
import { api } from "@/api";



const SignIn = () => {
  const {setName , setEmail , setLoggedIn , setAccessToken , accessToken} = useContext(AuthContext)
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      console.log(token)
      const fetchUser = async ()=>{
        try{
          const response = await api.get("users/me");
          console.log(response)
          setName(response.data.data.name)
          setEmail(response.data.data.email)
          setLoggedIn(true)
        }catch(err) {
          console.error("Auto-login failed:", err.response?.data || err.message);
          setLoggedIn(false);
          setAccessToken(null);
          //auto navigate to sign-in page
          navigation("/signin")
          localStorage.removeItem("accessToken");
  
        }
      }
      fetchUser()
      
    }, [accessToken]);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export default SignIn
