import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import Registerpage from "./pages/registerpage/Registerpage";
import Loginpage from "./pages/loginpage/Loginpage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRoutes from "./protected_routes/UserRoutes";
import Profilepage from "./pages/profilepage/Profilepage";
import Profileupdate from "./pages/profilepage/Profileupdate";
import Singleforumpage from "./pages/forum/Singleforumpage";
import ForgotPassword from "./pages/forgot_password/ForgotPassword";
import SearchResults from "./pages/searchpage/Searchpage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserPostPage from "./pages/forum/Userpostpage";
import GamePage from "./pages/game/Gamepage";
import HelpPage from "./components/Help";
import AdminRoutes from "./protected_routes/AdminRoutes";
import AdminGameDashboard from "./pages/admin/AdminGameDashboard";
import AdminUpdateGame from "./pages/admin/AdminUpdateGame";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Unrestrcted Routes */}

        <Route path="/" element={<Homepage />} />

        <Route path="/register" element={<Registerpage />} />

        <Route path="/login" element={<Loginpage />} />

        <Route path="/forgot_password" element={<ForgotPassword />} />

        <Route path="/user/games" element={<GamePage />} />

        <Route path="/search-results" element={<SearchResults />} />

        <Route path="/help" element={<HelpPage />} />

        {/* User Routes */}
        <Route element={<UserRoutes />}>
          <Route path="/profile/profile_page" element={<Profilepage />} />

          <Route
            path="/profile/profile_page/update/:id"
            element={<Profileupdate />}
          />

          <Route path="/user/user_posts/:id" element={<UserPostPage />} />

          <Route path="/forum/:id" element={<Singleforumpage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/game" element={<AdminGameDashboard />} />
          <Route path="/admin/update/:id" element={<AdminUpdateGame />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
