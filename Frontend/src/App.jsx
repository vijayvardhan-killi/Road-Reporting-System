import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import LandingPage from "./pages/LandingPage"
import { Routes , Route } from "react-router-dom"


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/signin" element={<SignIn/>}></Route>
    </Routes>
  )
}

export default App
