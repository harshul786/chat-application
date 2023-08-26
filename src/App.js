import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useEffect, useState } from "react";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";
import { useCookies } from "react-cookie";
import { Dna } from "react-loader-spinner";

function App() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { hash, pathname, search } = location;

  const [cookies, setCookie, removeCookie] = useCookies(["Auth"]);

  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user-profile", {
        method: "GET",
        //   body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://chatnexa.onrender.com/",
        },
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify(result));
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
    console.log(pathname);

    if (localStorage.getItem("userInfo")?.name) {
      navigate("/chats");
    } else if (cookies.Auth) {
      getUser();
    } else {
      if (pathname == "/" || pathname == "/signup") {
        return;
      }
      navigate("/");
    }
  }, []);

  return (
    <>
      {isLoading === true && (
        <div className="p-10 bg-black/25 rounded-2xl absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2">
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Login user={user} setUser={setUser} cookie={cookies.Auth} />
          }
        />
        <Route
          path="/signup"
          element={<Signup user={user} setUser={setUser} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
