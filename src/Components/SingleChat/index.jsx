import React, { useEffect, useRef, useState } from "react";
import { groupConsecutiveMessages } from "../../utils/utils";
import { ChatState } from "../../Context/chatProvider";
import { BsFillCaretLeftFill } from "react-icons/bs";
import DefaultProfile from "../DefaultProfile";
import Loading from "../Loading";
import io from "socket.io-client";
var socket, selectedChatCompare;

const YouMessage = ({ messages }) => {
  return (
    <div className="my-2 ml-10 flex flex-col gap-2">
      {messages.map((message, index) => (
        <div className={"relative"} key={index}>
          {index === messages.length - 1 ? (
            <>
              <div className="absolute z-10 -left-10 bottom-1 h-max">
                {message.sender.avatar ? (
                  <div className="w-[28px] h-[28px] overflow-hidden rounded-full relative">
                    <img
                      src={message.sender.avatar}
                      alt="avatar"
                      className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
                    />
                  </div>
                ) : (
                  <DefaultProfile height="28px" width="28px" size="20" />
                )}
              </div>

              <BsFillCaretLeftFill
                className={`absolute -left-[11px] bottom-0.5 text-gray-100`}
                size={20}
              />
            </>
          ) : (
            ""
          )}

          <div className="bg-gray-100 py-2 px-4 rounded-md max-w-xs">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

const MeMessage = ({ messages }) => {
  return (
    <div className="my-2 flex flex-col gap-2 items-end">
      {messages.map((message, index) => (
        <div className={"relative"} key={index}>
          {index === messages.length - 1 ? (
            <BsFillCaretLeftFill
              className={`rotate-180 absolute -right-[11px] bottom-0.5 text-blue-500`}
              size={20}
            />
          ) : (
            ""
          )}
          <div className="bg-blue-500 text-white py-2 px-4 rounded-md max-w-xs">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SingleChat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [groupedMessages, setGroupMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const [sendNewMessage, setSendNewMessage] = useState(null);
  const { user } = ChatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [whoTyping, setWhoTyping] = useState(null);

  function Chats() {
    const { user } = ChatState();
    const chatBottomRef = useRef(null);

    useEffect(() => {
      if (chatBottomRef.current && groupedMessages.length !== 0) {
        chatBottomRef.current.scrollIntoView({
          // behavior: "smooth",
          block: "end",
        });
      }
    }, [messages.length]);

    return (
      <div className="flex-1 overflow-y-scroll px-4 py-2 smooth-scroll">
        {/* Render grouped chat messages */}
        {groupedMessages.map((messageGroup, groupIndex) => {
          const senderId = messageGroup[0].sender._id;

          return senderId === user._id ? (
            <MeMessage key={groupIndex} messages={messageGroup} />
          ) : (
            <YouMessage key={groupIndex} messages={messageGroup} />
          );
        })}

        {groupedMessages.length !== 0 && (
          <div className="" ref={chatBottomRef} />
        )}
      </div>
    );
  }

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
        if (!chatId || chatId != messageRecieved.chat._id) {
          // give notifi
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

          setMessages((prevMessages) => [...prevMessages, result]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
  }, [messages]);

  if (isLoading) return <Loading />;
  else
    return (
      <div className="flex flex-col w-full md:h-screen h-[90vh]">
        <div className="h-16 relative flex flex-col justify-center bg-blue-500 text-white items-left px-4">
          <div
            className={`text-base absolute transition-all  ${
              isTyping ? "top-3" : "top-1/2 -translate-y-1/2"
            }`}
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

        <Chats />

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
    );
}
