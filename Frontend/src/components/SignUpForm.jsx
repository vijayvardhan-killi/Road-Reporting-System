import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Link } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/auth/authcontext"
import { signUp } from "@/api/auth"


export function SignUpForm({
  className,
  ...props
}) {
  
  const {email , setEmail ,password ,setPassword , name , setName , accessToken , setAccessToken } = useContext(AuthContext);
  const [error , setError] = useState(null);
  console.log("name",name);
  console.log("email",email);
  console.log("pass",password);
  console.log("accessToken",accessToken);

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const form = e.target.form; // get the form element that triggered the button

    if (!form.checkValidity()) {
      form.reportValidity(); // show built-in browser messages
      return;
    }
    const user = {
      name,
      email,
      password,
    }
    try{
      const token = await signUp(user);
      setAccessToken(token);
      
    }catch(err){
        const message = err.status === 409 ? "User Alredy exists" : "Something went wrong"
        setError(message)
    }
  }




  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required={true} value = {name} onChange={(e)=> {setName(e.target.value)}}  />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required={true} value = {email} onChange={(e)=> {setEmail(e.target.value)}}  />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required={true} value={password} onChange={(e) => {setPassword(e.target.value)}} />
              </div>
              {error && <p className=" text-red-500 text-center text-sm"> {error}</p>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer" onClick={handleSubmit}>
                  Sign up
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
             Already have an account?{" "}
              <Link to={"/signin"} className="underline underline-offset-4" >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
