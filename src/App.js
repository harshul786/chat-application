import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "./Pages/Profile";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import Loading from "./Components/Loading";
import Layout from "./Pages/Layout";

function App() {
  const [mode, setMode] = useState(null);

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

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={mode === null ? <Loading /> : <HomePage mode={mode} />}
        />
        <Route
          path="/chats"
          element={
            <Layout>
              <ChatPage />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
