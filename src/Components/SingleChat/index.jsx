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
                <DefaultProfile height="28px" width="28px" size="20" />
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

function Chats({ groupedMessages }) {
  const { user } = ChatState();
  const chatBottomRef = useRef(null);
  useEffect(() => {
    if (chatBottomRef.current && groupedMessages.length !== 0) {
      chatBottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [groupedMessages]);
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
        <div className="scroll-target" ref={chatBottomRef} />
      )}
    </div>
  );
}

export default function SingleChat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [groupedMessages, setGroupMessages] = useState([]);
  const [socketConnection, setSocketConnection] = useState(false);
  const [sendNewMessage, setSendNewMessage] = useState(null);
  const { user } = ChatState();

  useEffect(() => {
    socket = io();
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnection(true);
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
        console.error("Fetch error:", response.status);
      }

      setIsLoading(false);
      socket.emit("join chat", chatId);
    } catch (err) {
      setIsLoading(false);
      console.error("Fetch error:", err);
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
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    setGroupMessages(groupConsecutiveMessages(messages));
  }, [messages]);

  if (isLoading) return <Loading />;
  else
    return (
      <div className="flex flex-col w-full h-full ">
        <div
          className="h-16 bg-blue-500 text-white flex items-center px-4"
          key={chatName ? chatName : 101}
        >
          {chatName ? chatName : ""}
        </div>

        <Chats groupedMessages={groupedMessages} />

        <div className="h-14 bg-white border-t border-gray-200 flex items-center px-4">
          <input
            className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Type your message..."
            onChange={typingHandler}
            value={newMessage}
            onKeyDown={sendMessage}
          />
        </div>
      </div>
    );
}
