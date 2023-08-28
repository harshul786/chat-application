import { useEffect, useState } from "react";
import DefaultProfile from "../DefaultProfile";
import Loading from "../Loading";
import { ChatState } from "../../Context/chatProvider";

const Chat = (props) => {
  return (
    <div
      className="flex p-2 items-center border-b-[1px] border-gray-200 w-[96%]"
      onClick={props.onclick}
    >
      <DefaultProfile height="40px" width="40px" size="30" />
      <div className="flex flex-col px-2">
        <div className="font-semibold text-sm">{props.name}</div>
        <div className="text-xs">
          {props.latestMessage.slice(0, 20) + "..."}
        </div>
      </div>
    </div>
  );
};

export default function Chats() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const { selectedChat, setSelectedChat } = ChatState();

  const getChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat/fetch", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // No need to set Access-Control-Allow-Origin in headers for outgoing requests
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setChats(result);
      } else {
        console.error("Request failed:", response.status, response.statusText);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    getChats();
    console.log(chats);
  }, []);

  return (
    <div className="relative">
      <input
        className="w-[95%] bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-2 text-sm ml-auto mr-auto block"
        placeholder="Search"
      />
      <div className="h-full flex flex-col items-center mt-2">
        {/* <Chat name={"harshul"} latestMessage="I am sexy and I know it!" /> */}
        {isLoading ? (
          <Loading />
        ) : chats.length === 0 ? (
          <div className="text-sm tracking-wider italic">
            No Messages Found!
          </div>
        ) : (
          chats.map((chat, i) => {
            return (
              <Chat
                key={i}
                name={chat.chatName}
                latestMessage="I am sexy and I know it!"
                onclick={() => setSelectedChat(chat._id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
