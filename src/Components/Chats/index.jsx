import { useEffect, useState } from "react";
import DefaultProfile from "../DefaultProfile";
import Loading from "../Loading";
import { ChatState } from "../../Context/chatProvider";

export default function Chats() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const { selectedChat, setSelectedChat } = ChatState();
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState([]);
  const { user } = ChatState();

  const ChatFolder = (props) => {
    return (
      <a
        className="flex p-2 items-center border-b-[1px] border-gray-200 w-[96%] cursor-pointer hover:bg-slate-200 duration-150"
        href={props.link}
        onClick={() => setSelectedChat(props.name)}
      >
        <DefaultProfile height="40px" width="40px" size="30" />
        <div className="flex flex-col px-2">
          <div className="font-semibold text-sm">{props.name}</div>
          <div className="text-xs">
            {props.latestMessage.slice(0, 20) + "..."}
          </div>
        </div>
      </a>
    );
  };

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
        console.log(chats);
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
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filteredChats = chats.filter((chat) => {
      const chatNameMatches = chat.chatName
        .toLowerCase()
        .includes(search.toLowerCase());
      const secondUserNameMatches = chat.users[1]?.name
        .toLowerCase()
        .includes(search.toLowerCase());
      console.log(chatNameMatches, secondUserNameMatches);
      return chatNameMatches || secondUserNameMatches;
    });
    setFilterSearch(filteredChats);
  };

  return (
    <div className="">
      <input
        className="w-[95%] bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-2 text-sm ml-auto mr-auto block"
        placeholder="Search"
        value={search}
        // onChange={handleSearch}
      />
      <div className="h-full flex flex-col items-center mt-2">
        {isLoading ? (
          <Loading />
        ) : chats.length === 0 ? (
          <div className="text-sm tracking-wider italic">
            No Messages Found!
          </div>
        ) : filterSearch.length !== 0 ? (
          filterSearch.map((chat, i) => {
            return (
              <ChatFolder
                key={i}
                name={chat.isGroupChat ? chat.chatName : chat.users[1].name}
                latestMessage="I am sexy and I know it!"
                link={`/chats?id=${chat._id}`}
              />
            );
          })
        ) : (
          chats.map((chat, i) => {
            return (
              <ChatFolder
                key={i}
                name={
                  chat.isGroupChat
                    ? chat.chatName
                    : chat.users[0].name === user.name
                    ? chat.users[1].name
                    : chat.users[0].name
                }
                latestMessage="I am sexy and I know it!"
                link={`/chats?id=${chat._id}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
