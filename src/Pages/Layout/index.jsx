// import io from "socket.io-client";
import LeftBar from "../../Components/LeftBar";
import { ChatState } from "../../Context/chatProvider";

export default function Layout({ children }) {
  // const socket = io.connect();
  const { user } = ChatState();
  const { selectedChat } = ChatState();

  return (
    <div className="flex w-screen h-screen bg-white dark:bg-gray-950 transition-colors">
      <LeftBar />
      <div className="md:w-[75vw] md:block hidden h-screen relative ">
        {selectedChat === -1 ? (
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 py-1 px-4 bg-slate-100 dark:bg-slate-400 rounded-3xl w-max text-sm">
            Select a Chat to start messaging!
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
