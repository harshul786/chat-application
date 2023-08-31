// import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import LeftBar from "../../Components/LeftBar";
import { ChatState } from "../../Context/chatProvider";
import SingleChat from "../../Components/SingleChat";

export default function ChatPage() {
  // const socket = io.connect();
  const { user } = ChatState();
  const { selectedChat } = ChatState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  return (
    <div className="flex w-screen h-screen bg-white dark:bg-gray-950 transition-colors overflow-hidden">
      <LeftBar
        customClass={`${queryParams.get("id") ? "md:flex hidden" : ""}`}
      />
      <div
        className={`md:w-[75vw] w-screen ${
          queryParams.get("id") !== undefined ? "block" : "md:block hidden"
        }  h-screen overflow-hidden relative `}
      >
        {queryParams.get("id") == undefined ? (
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 py-1 px-4 bg-slate-100 dark:bg-slate-400 rounded-3xl w-max text-sm">
            Select a Chat to start messaging!
          </div>
        ) : (
          <SingleChat chatId={queryParams.get("id")} />
        )}
      </div>
    </div>
  );
}
