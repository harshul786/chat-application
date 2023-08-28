import { BsChatFill } from "react-icons/bs";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import { useEffect, useState } from "react";
import DefaultProfile from "../DefaultProfile";
import Chats from "../Chats";
import Loading from "../Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "../Profile";

export default function LeftBar(props) {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function SearchDrawer() {
    const [searchUsers, setSearchUsers] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/all-users", {
          method: "POST",
          body: JSON.stringify({ search: searchUsers }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();

        if (response.ok) {
          setUsers(result);
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("error", {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
        setIsLoading(false);
      }
    };

    return (
      <div className="md:w-[25vw] w-full h-full">
        <div className="text-center my-4">Add a new Chat</div>
        <div className="flex gap-2 justify-center px-4 mb-4">
          <input
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-2 text-sm "
            placeholder="Search Users"
            value={searchUsers}
            onChange={(e) => {
              setSearchUsers(e.target.value);
            }}
          />
          <button
            onClick={handleSearchUsers}
            className="p-2 bg-blue-400 rounded-lg text-white"
          >
            Go
          </button>
        </div>
        {users.map((user, i) => {
          return (
            <div
              className="flex flex-col gap-2 text-sm px-4 border-b border-gray-400"
              key={i}
            >
              <div>{user.name}</div>
              <div>{user.email}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="md:w-[25vw] w-full flex flex-col justify-between border-r-[1px] border-gray-200 dark:text-white relative">
      <section
        className={`z-[9] absolute left-0 top-0 h-screen w-full bg-white dark:bg-slate-800 shadow-2xl transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SearchDrawer />
      </section>

      <div className="w-full flex-col items-center ">
        <div className="flex justify-center p-4 w-full text-base">
          {selected === 0 ? (
            <section>
              Chats
              <BiSolidMessageRoundedAdd
                size={20}
                className="dark:text-gray-200 absolute z-10 right-4 top-[18px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            </section>
          ) : (
            "Profile"
          )}
        </div>

        {selected == 0 ? <Chats /> : <Profile />}
      </div>
      <div className="h-16 border-r border-t-[1px] border-gray-200 bg-white dark:bg-gray-950 transition-colors flex justify-around items-center px-4 fixed z-50 md:w-[25vw] w-full bottom-0">
        <DefaultProfile
          onclick={() => {
            setIsOpen(false);
            setSelected(1);
          }}
          height="28px"
          width="28px"
          size="20"
        />

        <BsChatFill
          size={25}
          className="text-gray-300 cursor-pointer hover:scale-[1.06] duration-150"
          onClick={() => {
            setSelected(0);
          }}
        />
      </div>
    </div>
  );
}
