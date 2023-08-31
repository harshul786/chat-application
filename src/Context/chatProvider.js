import React, { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

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
      if (response.ok && result.email) {
        localStorage.setItem("userInfo", JSON.stringify(result.user));
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
    if (!user) {
      if (localStorage.getItem("userInfo")) {
        setUser(JSON.parse(localStorage.getItem("userInfo")));
      } else if (cookies.Auth) {
        getUser();
      } else {
        navigate("/");
        return;
      }
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat }}
    >
      {isLoading === true && <Loading />}
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
