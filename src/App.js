import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "./Pages/Profile";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import Loading from "./Components/Loading";
import { useCookies } from "react-cookie";

function App() {
  const [mode, setMode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [cookies, setCookie, removeCookie] = useCookies(["Auth"]);

  useEffect(() => {
    // Function to check if the device is in dark mode
    const isDarkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setMode(isDarkModeMediaQuery.matches);
    const handleChange = (event) => {
      setMode(event.matches);
    };
    isDarkModeMediaQuery.addEventListener("change", handleChange);

    return () => {
      isDarkModeMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userInfo") && cookies.Auth) {
      if (pathname === "/") {
        navigate("/chats");
      }
    } else {
      navigate("/");
    }
  }, [cookies.Auth]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={mode === null ? <Loading /> : <HomePage mode={mode} />}
        />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
