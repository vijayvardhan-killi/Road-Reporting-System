import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import LandingPage from "./pages/LandingPage"
import CreateTicket from "./pages/CreateTicket"
import { Routes , Route } from "react-router-dom"


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/signin" element={<SignIn/>}></Route>
      <Route path="/ticket" element={<CreateTicket/>}></Route>
    </Routes>
  )
}

export default App
