import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Bg from "../../images/bg";
import BgDark from "../../images/bgdark";
import Login from "../../Components/Login";
import Signup from "../../Components/Signup";
import { useNavigate } from "react-router-dom";

export default function HomePage(props) {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const userAgent = navigator.userAgent;
  const isAndroidChrome = /Android.*Chrome\//.test(userAgent);
  const isIOSChrome = /CriOS/.test(userAgent); // Chrome on iOS
  const isIOSSafari = /Version.*Mobile.*Safari/.test(userAgent);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/chats");
    }
  }, []);

  return (
    <section className="bg-gray-50 ">
      <div
        className={`absolute z-0 md:h-screen${
          isIOSSafari
            ? "h-[90vh]"
            : isIOSChrome || isAndroidChrome
            ? "h-[87vh]"
            : "h-screen"
        } w-screen overflow-hidden`}
      >
        {props.mode ? <BgDark /> : <Bg />}
      </div>
      {page === 0 ? (
        <Login page={page} setPage={setPage} />
      ) : (
        <Signup page={page} setPage={setPage} />
      )}
    </section>
  );
}
