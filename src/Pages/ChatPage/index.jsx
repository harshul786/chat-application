import { useEffect, useState } from "react";
// import io from "socket.io-client";
import { ChatState } from "../../Context/chatProvider";
import { BsChatFill, BsPersonFill } from "react-icons/bs";
import Loading from "../../Components/Loading";

function DefaultProfile(props) {
  return (
    <div className="h-10 w-10 rounded-full flex justify-center items-center bg-gray-300">
      <BsPersonFill
        size={30}
        onClick={props.onclick}
        className="text-gray-50 dark:text-gray-900 cursor-pointer hover:scale-[1.06] duration-150"
      />
    </div>
  );
}

function LeftBar(props) {
  const [selected, setSelected] = useState(0);

  function Chats() {
    const [isLoading, setIsLoading] = useState(false);
    const [chats, setChats] = useState([]);

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
          console.error(
            "Request failed:",
            response.status,
            response.statusText
          );
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

    const Chat = (props) => {
      return (
        <div className="flex p-2 items-center border-b-[1px] border-gray-200 w-[96%]">
          <DefaultProfile />
          <div className="flex flex-col px-2">
            <div className="font-semibold text-sm">{props.name}</div>
            <div className="text-xs">
              {props.latestMessage.slice(0, 20) + "..."}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div>
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
                />
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-[25vw] w-full flex flex-col justify-between border-r-[1px] border-gray-200 dark:text-white">
      <div className="w-full flex-col items-center ">
        <div className="flex justify-center relative p-4 w-full text-base">
          {selected === 0 ? "Chats" : "Profile"}
          <div className="absolute right-4 top-4">+</div>
        </div>

        {selected == 0 && <Chats />}
      </div>
      <div className="h-16 border-t-[1px] border-gray-200 flex justify-around items-center px-4 fixed md:w-[25vw] w-full bottom-0">
        <DefaultProfile onclick={() => setSelected(1)} />

        <BsChatFill
          size={35}
          className="text-gray-300 cursor-pointer hover:scale-[1.06] duration-150"
          onClick={() => setSelected(0)}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  // const socket = io.connect();
  const { user } = ChatState();

  return (
    <div className="flex w-screen h-screen bg-white dark:bg-black transition-colors">
      <LeftBar />
      <div></div>
    </div>
  );
}
