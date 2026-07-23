import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import LandingPage from "./pages/LandingPage"
import CreateTicket from "./pages/CreateTicket"
import MyTickets from "./pages/MyTickets"
import TicketDetail from "./pages/TicketDetail"
import AdminDashboard from "./pages/AdminDashboard"
import SuperAdminDashboard from "./pages/SuperAdminDashboard"
import AreaTickets from "./pages/AreaTickets"
import AllTickets from "./pages/AllTickets"
import Leaderboard from "./pages/Leaderboard"
import AnnualReport from "./pages/AnnualReport"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/leaderboard" element={<Leaderboard />}></Route>

      {/* public — supports both signed-in and anonymous reporting */}
      <Route path="/ticket" element={<CreateTicket />}></Route>
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute roles={["civillian"]}>
            <MyTickets />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/tickets/area/:areaId"
        element={
          <ProtectedRoute roles={["admin", "superadmin"]}>
            <AreaTickets />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/tickets"
        element={
          <ProtectedRoute roles={["superadmin"]}>
            <AllTickets />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute roles={["superadmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/annual-report"
        element={
          <ProtectedRoute roles={["admin", "superadmin"]}>
            <AnnualReport />
          </ProtectedRoute>
        }
      ></Route>
      </Routes>
    </>
  )
}

export default App
