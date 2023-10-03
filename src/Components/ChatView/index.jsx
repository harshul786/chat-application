import { BsFillCaretLeftFill } from "react-icons/bs";
import DefaultProfile from "../DefaultProfile";
import { ChatState } from "../../Context/chatProvider";
import React, { useEffect, useRef, useState } from "react";
import ModalContainer from "../ModalContainer";
import { IoCloseCircle } from "react-icons/io5";

const YouMessage = ({ messages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="my-2 ml-10 flex flex-col gap-2">
      <div className="-mb-1 px-4 text-sm tracking-wider dark:text-white">
        {messages[0].sender.name}
      </div>

      {messages.map((message, index) => (
        <div className={"relative"} key={index}>
          {console.log(message, "message")}
          {index === messages.length - 1 ? (
            <>
              <div className="absolute z-10 -left-10 bottom-1 h-max">
                {message.sender.avatar ? (
                  <ModalContainer
                    user={message.sender}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                  >
                    <div className="w-[28px] h-[28px] overflow-hidden rounded-full relative z-[2]">
                      <img
                        src={message.sender.avatar}
                        alt="avatar"
                        className="h-full w-auto z-[2] object-cover absolute top-0 left-1/2 -translate-x-1/2"
                      />
                    </div>
                  </ModalContainer>
                ) : (
                  <ModalContainer
                    user={message.sender}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                  >
                    <DefaultProfile height="28px" width="28px" size="20" />
                  </ModalContainer>
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

      <div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-800 opacity-50"></div>
            <div className="relative md:w-[40vw] w-[85vw] bg-white pt-2 rounded-lg shadow-lg">
              <IoCloseCircle
                onClick={() => setIsModalOpen(false)}
                size={24}
                className="absolute rounded-full bg-white -top-2 -right-2 text-gray-600 hover:text-gray-800 transition duration-300 cursor-pointer hover:scale-105"
              />

              <div className="w-full">
                <div className="text-lg tracking-wider font-semibold px-6">
                  {messages[0].sender.name}
                </div>
                {messages[0].sender.avatar ? (
                  <img
                    src={messages[0].sender.avatar}
                    alt="avatar"
                    className="h-auto w-full"
                  />
                ) : (
                  <div>
                    <div className="md:flex hidden bg-gray-300 justify-center items-center">
                      <DefaultProfile height="40vw" width="40vw" size="100" />
                    </div>
                    <div className="md:hidden flex justify-center items-center bg-gray-300">
                      <DefaultProfile height="85vw" width="85vw" size="100" />
                    </div>
                  </div>
                )}

                <div className="text-sm tracking-wider w-full px-6 py-2">
                  {"Bio: " + messages[0].sender.bio}
                </div>

                <div className="text-sm tracking-wider w-full px-6 pb-2">
                  {"Email: " + messages[0].sender.email}
                </div>

                {/* Add more user information as needed */}
              </div>
            </div>
          </div>
        )}
      </div>
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
