import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import Profile from "./Pages/Profile";

function App() {
  const cookies = new Cookies();
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    console.log({ user, token });
    if (token) {
      console.log(cookies.get("Authentication"));
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login user={user} setUser={setUser} setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={<Signup user={user} setUser={setUser} />}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
