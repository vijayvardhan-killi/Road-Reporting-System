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
import { Link } from "react-router-dom"
import { AuthContext } from "@/context/auth/authcontext"
import { useState, useContext } from "react"
import { signIn } from "@/api/auth"
export function LoginForm({
  className,
  ...props
}) {

  const { email, setEmail, password, setPassword, loggedIn, setLoggedIn, setAccessToken } = useContext(AuthContext);
  const [error, setError] = useState(null);
  console.log("email", email)
  console.log("pass", password)
  console.log("login",loggedIn)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target.form; // get the form element that triggered the button

    if (!form.checkValidity()) {
      form.reportValidity(); // show built-in browser messages
      return;
    }
    //build user object
    const user = {
      email,
      password,
    }

    try {
      const token = await signIn(user);
      console.log("token :",token)
      setAccessToken(token);
      setLoggedIn(true);
    } catch (err) {
      const status = err.status;
      var errorMessage = "";
      //match the error code to provide relevent information
      switch (status) {
        case 401:
          errorMessage = "Email or Password";
          break
        case 404:
          errorMessage = "User Not Found";
          break
        default:
          errorMessage = "Something went wrong try again"
          break
        }
      setLoggedIn(false)
      setError(errorMessage)
    }
  }



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => { setEmail(e.target.value) }} />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => { setPassword(e.target.value) }} />
              </div>
              {error && <p className=" text-red-500 text-center text-sm"> {error}</p>}
              <div className="flex flex-col gap-3">
                <Button className="w-full cursor-pointer" onClick={handleSubmit}>
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={"/signup"} className="underline underline-offset-4" >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
