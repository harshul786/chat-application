import React, { useEffect, useRef, useState } from "react";
import { groupConsecutiveMessages } from "../../utils/utils";
import { ChatState } from "../../Context/chatProvider";
import { BsFillCaretLeftFill } from "react-icons/bs";
import DefaultProfile from "../DefaultProfile";
import Loading from "../Loading";

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

export default function SingleChat({ chatId }) {
  const chatBottomRef = useRef(null);
  const { user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [groupedMessages, setGroupMessages] = useState([]);

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
        console.error("Request failed:", response.status, response.statusText);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Fetch error:", err);
    }
  };

  useEffect(async () => {
    getMessages();
  }, []);

  const sendMessage = async (event) => {
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
          setMessages((prevMessages) => [...prevMessages, result]);
          if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    console.log(newMessage);
  };

  useEffect(() => {
    setGroupMessages(groupConsecutiveMessages(messages));
  }, [messages]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatBottomRef, groupedMessages]);

  if (isLoading) return <Loading />;
  else
    return (
      <div className="flex flex-col w-full h-full relative">
        <div
          className="h-16 bg-blue-500 text-white flex items-center px-4"
          key={chatName ? chatName : 101}
        >
          {chatName ? chatName : ""}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 relative">
          {/* Render grouped chat messages */}
          {groupedMessages.map((messageGroup, groupIndex) => {
            const senderId = messageGroup[0].sender._id;

            return senderId === user._id ? (
              <MeMessage key={groupIndex} messages={messageGroup} />
            ) : (
              <YouMessage key={groupIndex} messages={messageGroup} />
            );
          })}
          <div className="absolute bottom-0" ref={chatBottomRef} />
        </div>

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
