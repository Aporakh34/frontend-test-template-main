import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PinPage from "./pages/PinPage/PinPage";
import RegCodePage from "./pages/RegCodePage/RegCodePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      navigate("/profile");
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reg" element={<RegisterPage />} />
        <Route path="/auth/email" element={<PinPage />} />
        <Route path="/reg/code" element={<RegCodePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
