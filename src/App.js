import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import Loading from "./Components/Loading";
import { useCookies } from "react-cookie";
import { ChatState } from "./Context/chatProvider";

function App() {
  const [mode, setMode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [cookies, setCookie, removeCookie] = useCookies(["Auth"]);
  const { user, setUser } = ChatState();
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user-profile", {
        method: "GET",
        //   body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok && result.email) {
        localStorage.setItem("userInfo", JSON.stringify(result.user));
        console.log(result.user);
        setUser(result.user);
        navigate("/chats");
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      return;
    }
  };

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

  // useEffect(() => {
  //   if (localStorage.getItem("userInfo")) {
  //     if (pathname === "/") {
  //       navigate("/chats");
  //     }
  //   } else {
  //     if (pathname !== "/") {
  //       console.log("here", localStorage.getItem("userInfo"));
  //       navigate("/");
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!user) {
  //     getUser();
  //   }
  // }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={mode === null ? <Loading /> : <HomePage mode={mode} />}
        />
        <Route path="/chats" element={isLoading ? <Loading /> : <ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
