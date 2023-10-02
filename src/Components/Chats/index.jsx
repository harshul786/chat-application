import { useEffect, useState } from "react";
import DefaultProfile from "../DefaultProfile";
import Loading from "../Loading";
import { ChatState } from "../../Context/chatProvider";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";

export default function Chats() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const { selectedChat, setSelectedChat } = ChatState();
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState(null);
  const {
    user,
    notifications,
    setNotifications,
    fetchChats,
    setFetchChats,
    newLatestMessage,
    setNewLatestMessage,
  } = ChatState();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const ChatFolder = (props) => {
    return (
      <a
        className="flex p-2 items-center border-b-[1px] border-gray-200 w-[96%] cursor-pointer hover:bg-slate-200 dark:hover:text-black duration-150"
        href={props.link}
        onClick={() => setSelectedChat(props.name)}
      >
        {props.chat?.avatar ? (
          <div className="w-10 h-10 overflow-hidden rounded-full relative">
            <img
              src={props.chat.avatar}
              alt="avatar"
              className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
            />
          </div>
        ) : (
          <DefaultProfile height="40px" width="40px" size="30" />
        )}

        <div className="flex flex-col px-2">
          <div className="font-semibold text-sm">{props.name}</div>
          <div className="text-xs">
            {props.latestMessage.length > 20
              ? props.latestMessage.slice(0, 20) + "..."
              : props.latestMessage}
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
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setChats(result);
        console.log(chats);
      } else {
        console.log("Request failed:", response.status, response);
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

  useEffect(() => {
    if (fetchChats) {
      getChats();
      setFetchChats(false);
    }
  }, [fetchChats]);

  useEffect(() => {
    if (newLatestMessage !== null) {
      setChats((prevChats) => {
        const newChats = prevChats.map((chat) => {
          if (chat._id === newLatestMessage.chatId) {
            console.log(chat, newLatestMessage);
            const updatedLatestMessage = {
              ...chat.latestMessage,
              content: newLatestMessage.content,
            };
            return {
              ...chat,
              latestMessage: updatedLatestMessage,
            };
          }
          return chat;
        });
        return newChats;
      });
    }
    setNewLatestMessage(null);
  }, [newLatestMessage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filteredChats = chats.filter((chat) => {
      const chatNameMatches = chat.chatName
        .toLowerCase()
        .includes(search.toLowerCase());
      const nameMatches = chat.users?.some((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );

      return chatNameMatches || nameMatches;
    });

    setFilterSearch(filteredChats);
  };

  return (
    <div className="relative">
      <div className="absolute -top-10 left-4">
        <IoIosNotifications
          size={23}
          className="cursor-pointer text-black dark:text-white"
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        />
        {notifications.length > 0 && (
          <div className="bg-red-600 h-4 w-4 text-[10px] flex items-center justify-center rounded-full relative -top-6 -right-3">
            {notifications.length}
          </div>
        )}
      </div>

      <div
        className={`${
          isNotificationsOpen ? "max-h-44" : ""
        } absolute z-[100] -top-2.5 left-1/2 -translate-x-1/2 rounded-md bg-slate-200 overflow-y-scroll max-h-0 w-[90%] text-black`}
        style={{ transition: "max-height 0.5s ease-in-out" }}
      >
        {notifications?.map((notification, i) => {
          console.log(notification);
          return (
            <a
              key={i}
              href={`/chats?id=${notification.chat._id}`}
              onClick={() => {
                setIsNotificationsOpen(false);
                setNotifications(
                  notifications.filter((noti) => noti._id !== notification._id)
                );
                // navigate(`/chats?id=${notification.chat._id}`);
              }}
              className="flex cursor-pointer gap-1 hover:bg-slate-300 duration-150 items-center p-2 w-full border-b-[1px] border-gray-200"
            >
              {notification.sender.avatar ? (
                <div className="w-8 h-8 overflow-hidden rounded-full relative">
                  <img
                    src={notification.sender.avatar}
                    alt="avatar"
                    className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
                  />
                </div>
              ) : (
                <DefaultProfile height="32px" width="32px" size="24" />
              )}
              <div className="flex-1 gap-1">
                <div className="font-semibold text-sm">
                  {notification.sender.name}
                </div>
                <div className="text-xs">
                  {notification.content.length > 20
                    ? notification.content.slice(0, 20)
                    : notification.content}
                </div>
              </div>
            </a>
          );
        })}
      </div>
      <input
        className="w-[95%] bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-2 text-sm ml-auto mr-auto block"
        placeholder="Search"
        value={search}
        onChange={handleSearch}
      />
      <div className="h-full flex flex-col items-center mt-2">
        {isLoading ? (
          <Loading />
        ) : chats.length === 0 ? (
          <div className="text-sm tracking-wider italic">
            No Messages Found!
          </div>
        ) : filterSearch?.length === 0 &&
          filterSearch !== null &&
          search.length !== 0 ? (
          <div>No results found!</div>
        ) : filterSearch !== null ? (
          filterSearch.map((chat, i) => {
            return (
              <ChatFolder
                key={i}
                name={
                  chat.isGroupChat
                    ? chat.chatName
                    : chat.users[0]._id ===
                      JSON.parse(localStorage.getItem("userInfo"))._id
                    ? chat.users[1].name
                    : chat.users[0].name
                }
                chat={
                  chat.isGroupChat
                    ? null
                    : chat.users[0]._id ===
                      JSON.parse(localStorage.getItem("userInfo"))._id
                    ? chat.users[1]
                    : chat.users[0]
                }
                latestMessage={
                  chat.latestMessage?.content ? chat.latestMessage.content : ""
                }
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
                    : chat.users[0]._id ===
                      JSON.parse(localStorage.getItem("userInfo"))._id
                    ? chat.users[1].name
                    : chat.users[0].name
                }
                chat={
                  chat.isGroupChat
                    ? null
                    : chat.users[0]._id ===
                      JSON.parse(localStorage.getItem("userInfo"))._id
                    ? chat.users[1]
                    : chat.users[0]
                }
                latestMessage={
                  chat.latestMessage?.content ? chat.latestMessage.content : ""
                }
                link={`/chats?id=${chat._id}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
