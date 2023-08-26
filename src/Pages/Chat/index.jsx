import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Chat() {
  const socket = io.connect();
  const [c, setC] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on("countUpdate", (count) => {
      console.log(c);
      setC(count);
    });
  }, [socket]);
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen ">
      <div className="text-xl flex gap-2">
        <span>Current Count:</span> <span id={`#${c}`}>{c}</span>
      </div>
      <button
        className="text-lg p-4 bg-black text-white rounded-lg"
        onClick={() => socket.emit("increment")}
      >
        +1
      </button>
    </div>
  );
}
