import { useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";

import Bg from "../../images/bg";
import BgDark from "../../images/bgdark";
import Login from "../../Components/Login";
import Signup from "../../Components/Signup";
import { ChatState } from "../../Context/chatProvider";
import { useNavigate } from "react-router-dom";

export default function HomePage(props) {
  const [page, setPage] = useState(0);
  const { user } = ChatState();

  return (
    <section className="bg-gray-50 ">
      <div className="absolute z-0 h-screen w-screen overflow-hidden">
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
