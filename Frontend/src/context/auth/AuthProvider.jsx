import { useState, useEffect } from "react";
import { AuthContext } from "./authcontext";
import { api } from "@/api";
import { useNavigate } from "react-router-dom";
const AuthProvider = (props) => {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  
  //auto login if JWT token id is present already
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
    
  }, []);

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        accessToken,
        setAccessToken,
        name,
        setName,
        loggedIn,
        setLoggedIn,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
