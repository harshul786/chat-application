import React, { useEffect, useState } from "react";
import { groupConsecutiveMessages } from "../../utils/utils";
import { ChatState } from "../../Context/chatProvider";
import Loading from "../Loading";
import io from "socket.io-client";
import ChatView from "../ChatView";
var socket;

function SingleChat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [groupedMessages, setGroupMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const [sendNewMessage, setSendNewMessage] = useState(null);
  const {
    user,
    notifications,
    setNotifications,
    setFetchChats,
    setNewLatestMessage,
  } = ChatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [whoTyping, setWhoTyping] = useState(null);

  useEffect(() => {
    socket = io();
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnection(true);
      });
      socket.on("typing", (userName) => {
        setWhoTyping(userName);
        setIsTyping(true);
      });
      socket.on("stop typing", (userName) => {
        setIsTyping(false);
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, socket]);

  const getMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/message/${chatId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(result.messages);
        setChatName(result.chatName);
      } else {
        // err
      }

      setIsLoading(false);
      socket.emit("join chat", chatId);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(async () => {
    getMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (messageRecieved) => {
        setFetchChats(true);
        if (!chatId || chatId != messageRecieved.chat._id) {
          // give notifi
          if (!notifications.includes(messageRecieved)) {
            setNotifications((prevNotifications) => [
              messageRecieved,
              ...prevNotifications,
            ]);
            localStorage.setItem(
              "notifications",
              JSON.stringify(notifications)
            );
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, messageRecieved]);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (sendNewMessage && socket) {
      socket.emit("new message", sendNewMessage);
      setSendNewMessage(null);
    }
  }, [sendNewMessage]);

  var sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.length > 0) {
      event.preventDefault();
      if (socket) {
        socket.emit("stop typing", chatId, user.name);
      }

      try {
        setNewMessage("");
        const response = await fetch("/api/message/send-message", {
          method: "POST",
          body: JSON.stringify({ chatId, content: newMessage }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
          setSendNewMessage(result);
          // socket.emit("new message", result);
          setNewLatestMessage({ content: newMessage, chatId: chatId });

          setMessages((prevMessages) => [...prevMessages, result]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log("typing: " + isTyping);
  }, [isTyping]);

  const typingHandler = (e) => {
    e.preventDefault();
    setNewMessage(e.target.value);

    if (!socketConnection) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatId, user.name);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatId, user.name);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    setGroupMessages(groupConsecutiveMessages(messages));
    console.log(groupedMessages);
  }, [messages]);

  useEffect(() => {
    console.log(groupedMessages);
  }, [groupedMessages]);

  const userAgent = navigator.userAgent;
  const isAndroidChrome = /Android.*Chrome\//.test(userAgent);
  const isIOSChrome = /CriOS/.test(userAgent); // Chrome on iOS
  const isIOSSafari = /Version.*Mobile.*Safari/.test(userAgent);

  return (
    <div key={chatId} id={chatId}>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`flex flex-col w-full md:h-screen ${
            isIOSSafari
              ? "h-[90vh]"
              : isIOSChrome || isAndroidChrome
              ? "h-[87vh]"
              : "h-screen"
          }`}
        >
          <div className="h-16 relative flex flex-col justify-center bg-blue-500 text-white items-left px-4">
            <div
              className={`text-base absolute transition-all ${
                isTyping ? "top-3" : "top-1/2 -translate-y-1/2"
              }`}
              id={chatName}
              key={chatName}
            >
              {chatName ? chatName : ""}
            </div>

            <div
              className={`text-xs absolute bottom-3 transition-all ${
                isTyping ? "text-white" : "text-transparent"
              }`}
              key={isLoading ? "111" : "222"}
            >
              {messages[0]
                ? messages[0].chat.isGroupChat
                  ? whoTyping + " is Typing..."
                  : "Typing..."
                : "Typing..."}
            </div>
          </div>

          <ChatView
            groupedMessages={groupedMessages}
            id={chatId}
            key={chatId}
          />

          <div className="h-14 bg-white dark:bg-gray-950 border-t border-gray-200 flex items-center px-4">
            <input
              className="w-full touch-manipulation py-2 px-4 dark:bg-gray-900 dark:text-white dark:!border-0 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Type your message..."
              onChange={typingHandler}
              value={newMessage}
              onKeyDown={sendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
