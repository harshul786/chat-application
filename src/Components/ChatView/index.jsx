import { BsFillCaretLeftFill } from "react-icons/bs";
import DefaultProfile from "../DefaultProfile";
import { ChatState } from "../../Context/chatProvider";
import React, { useEffect, useRef } from "react";

const YouMessage = ({ messages }) => {
  return (
    <div className="my-2 ml-10 flex flex-col gap-2">
      <div className="-mb-1 px-4 text-sm tracking-wider dark:text-white">
        {messages[0].sender.name}
      </div>
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
                className={`absolute -left-[10.5px] bottom-[9px] text-gray-100`}
                size={22}
              />
            </>
          ) : (
            ""
          )}

          <div className="bg-gray-100 py-2 px-4 rounded-[20px] max-w-xs">
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
              className={`rotate-180 absolute -right-[10.5px] bottom-[8.5px] text-blue-500`}
              size={22}
            />
          ) : (
            ""
          )}
          <div className="bg-blue-500 text-white py-2 px-4 rounded-[20px] max-w-xs">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ChatView({ groupedMessages }) {
  const { user } = ChatState();
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      console.log("scroll");
      chatBottomRef.current.scrollIntoView({
        // behavior: "smooth",
        block: "end",
      });
    }
  }, [
    groupedMessages.length,
    groupedMessages[groupedMessages.length - 1]?.length,
  ]);

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

      {groupedMessages.length !== 0 && <div className="" ref={chatBottomRef} />}
    </div>
  );
}
