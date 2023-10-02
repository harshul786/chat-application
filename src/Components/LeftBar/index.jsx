import { BsChatFill, BsFillCaretLeftFill } from "react-icons/bs";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import DefaultProfile from "../DefaultProfile";
import Chats from "../Chats";
import Loading from "../Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "../Profile";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/chatProvider";
import { AiOutlineArrowRight, AiFillCloseCircle } from "react-icons/ai";

export default function LeftBar(props) {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChatOption, setSelectedChatOption] = useState(0);
  const { user } = ChatState();

  function SearchDrawer() {
    const [searchUsers, setSearchUsers] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

    const createNewChat = async (id) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/chat/access", {
          method: "POST",
          body: JSON.stringify({ userId: id }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Chat Created!", {
            position: "top-left",
            autoClose: 5000,
            theme: "dark",
          });
          setIsOpen(false);

          navigate(`/chats?id=${result._id}`);
          window.location.reload();
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
      <div className="md:w-[25vw] w-full h-full relative dark:text-white">
        <IoClose
          className="absolute left-4 top-0 dark:text-white text-black cursor-pointer"
          onClick={() => {
            setSelectedChatOption(0);
          }}
          size={20}
        />
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
              className="flex hover:bg-slate-200 cursor-pointer duration-150 dark:hover:text-black items-center gap-2 text-sm px-2 mx-3 py-4 border-b border-gray-400"
              key={i}
              onClick={() => createNewChat(user._id)}
            >
              <div>
                <DefaultProfile height="28px" width="28px" size="20" />
              </div>
              <div className="w-[85%]">
                <div className="font-semibold truncate">{user.name}</div>
                <div className="truncate">{user.email}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function NewGroupBar() {
    const [searchUsers, setSearchUsers] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [submited, setSubmited] = useState(false);

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

    const handleSubmitGroup = async () => {
      const newGroupUsers = groupMembers.map((user) => user._id);
      console.log(JSON.stringify({ users: newGroupUsers, name: groupName }));
      if (groupName.length === 0) {
        toast.error("Group name cannot be empty", {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/chat/create-group", {
          method: "POST",
          body: JSON.stringify({ users: newGroupUsers, name: groupName }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await response.json();
        if (response.ok) {
          toast.success("Group Created!", {
            position: "top-left",
            autoClose: 5000,
            theme: "dark",
          });
          setIsOpen(false);
          navigate(`/chats?id=${result._id}`);
          window.location.reload();
        } else {
          toast.error("error", {
            position: "top-left",
            autoClose: 5000,
            theme: "dark",
          });
        }
        setIsLoading(false);
      } catch (error) {
        toast.error(error, {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });
        setIsLoading(false);
      }
    };

    return (
      <div className="md:w-[25vw] flex-1 overflow-y-auto w-full h-full relative dark:text-white">
        {submited ? (
          <AiOutlineArrowRight
            className="rotate-180 absolute left-4 top-4 dark:text-white text-black cursor-pointer"
            onClick={() => {
              setSubmited(false);
            }}
            size={20}
          />
        ) : (
          <IoClose
            className="absolute left-4 top-4 dark:text-white text-black cursor-pointer"
            onClick={() => {
              setSelectedChatOption(0);
            }}
            size={20}
          />
        )}
        <div className="text-center my-4">Create a New Group</div>

        {submited ? (
          <>
            <div className="flex gap-2 justify-center px-4 mb-4">
              <input
                className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg px-4 py-2 text-sm "
                placeholder="Set Group Name"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
              <button
                onClick={handleSubmitGroup}
                className="p-2 bg-blue-400 rounded-lg text-white"
              >
                Go
              </button>
            </div>

            <div className="flex flex-wrap gap-2 w-full">
              {groupMembers.map((user, i) => {
                return (
                  <div
                    className="flex flex-col items-center justify-center gap-2 text-sm"
                    onClick={() => {
                      groupMembers.length <= 2
                        ? toast.error("Members cannot be less than 3", {
                            position: "top-left",
                            autoClose: 5000,
                            theme: "dark",
                          })
                        : setGroupMembers((members) =>
                            members.filter((member) => member._id !== user._id)
                          );
                    }}
                  >
                    <div className="relative">
                      {user?.avatar ? (
                        <div className="w-[28px] h-[28px] overflow-hidden rounded-full relative">
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
                          />
                        </div>
                      ) : (
                        <DefaultProfile height="28px" width="28px" size="20" />
                      )}
                      <AiFillCloseCircle
                        className="absolute -top-1 -right-1"
                        size={12}
                      />
                    </div>

                    <div className="truncate">
                      {user.name.length > 10
                        ? user.name.slice(0, 10) + "..."
                        : user.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
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
              <button
                onClick={() =>
                  groupMembers.length >= 2
                    ? setSubmited(true)
                    : toast.error("Add atleast 3 members", {
                        position: "top-left",
                        autoClose: 5000,
                        theme: "dark",
                      })
                }
                className="p-2 bg-blue-400 rounded-lg text-white"
              >
                <AiOutlineArrowRight size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 w-full">
              {groupMembers.map((user, i) => {
                return (
                  <div
                    className="flex flex-col items-center justify-center gap-2 text-sm"
                    onClick={() =>
                      setGroupMembers((members) =>
                        members.filter((member) => member._id !== user._id)
                      )
                    }
                  >
                    <div className="relative">
                      {user?.avatar ? (
                        <div className="w-[28px] h-[28px] overflow-hidden rounded-full relative">
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
                          />
                        </div>
                      ) : (
                        <DefaultProfile height="28px" width="28px" size="20" />
                      )}
                      <AiFillCloseCircle
                        className="absolute -top-1 -right-1"
                        size={12}
                      />
                    </div>
                    <div className="truncate">
                      {user.name.length > 10
                        ? user.name.slice(0, 10) + "..."
                        : user.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {users.map((user, i) => {
              return (
                <div
                  className="flex hover:bg-slate-200 cursor-pointer duration-150 dark:hover:text-black items-center gap-2 text-sm px-2 mx-3 py-4 border-b border-gray-400"
                  key={i}
                  onClick={() => setGroupMembers([...groupMembers, user])}
                >
                  <div>
                    <DefaultProfile height="28px" width="28px" size="20" />
                  </div>
                  <div className="w-[85%]">
                    <div className="font-semibold truncate">{user.name}</div>
                    <div className="truncate">{user.email}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }
  const userAgent = navigator.userAgent;
  const isAndroidChrome = /Android.*Chrome\//.test(userAgent);
  const isIOSChrome = /CriOS/.test(userAgent); // Chrome on iOS
  const isIOSSafari = /Version.*Mobile.*Safari/.test(userAgent);

  return (
    <div
      className={`${props.customClass} md:w-[25vw] w-full flex flex-col justify-between border-r-[1px] border-gray-200 dark:text-white relative`}
    >
      <ToastContainer />
      <section
        className={`z-[9] absolute dark:text-black left-0 top-0 md:h-screen ${
          isIOSSafari
            ? "h-[90vh]"
            : isIOSChrome || isAndroidChrome
            ? "h-[87vh]"
            : "h-screen"
        }  w-full bg-white dark:bg-slate-800 shadow-2xl transition-transform ${
          selectedChatOption === 1 ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SearchDrawer />
      </section>
      <section
        className={`z-[9] absolute dark:text-black left-0 top-0 md:h-screen h-[90vh] w-full bg-white dark:bg-slate-800 shadow-2xl transition-transform ${
          selectedChatOption === 2 ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NewGroupBar />
      </section>
      <div
        className={`z-[9] absolute bg-gray-100 dark:text-black left-1/2 -translate-x-1/2 w-[90%] top-10 flex flex-col items-start rounded-md h-max max-h-0 overflow-hidden ${
          isOpen ? "max-h-44" : ""
        }`}
        style={{ transition: "max-height 0.4s ease" }}
      >
        <div
          className="px-3 py-2 w-full hover:bg-gray-200 cursor-pointer transition"
          onClick={() => {
            setSelectedChatOption(1);
            setIsOpen(false);
          }}
        >
          Create a new Chat
        </div>
        <div
          className="px-3 py-2 w-full hover:bg-gray-200 cursor-pointer transition"
          onClick={() => {
            setSelectedChatOption(2);
            setIsOpen(false);
          }}
        >
          Create a new Group
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-scroll items-center ">
        <div className="flex justify-center p-4 w-full text-base">
          {selected === 0 ? (
            <section>
              Chats
              <BiSolidMessageRoundedAdd
                size={20}
                className="dark:text-gray-200 absolute z-20 right-4 top-[18px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            </section>
          ) : (
            "Profile"
          )}
        </div>

        {selected === 0 ? <Chats /> : <Profile />}
      </div>

      <div className="h-14 border-r border-t-[1px] border-gray-200 bg-white dark:bg-gray-950 transition-colors flex justify-around items-center px-4 z-50 md:w-[25vw] w-full ">
        <div
          onClick={() => {
            setSelected(1);
            setIsOpen(false);
          }}
          className="w-[28px] h-[28px]"
        >
          {user?.avatar ? (
            <div className="w-[28px] h-[28px] overflow-hidden rounded-full relative">
              <img
                src={user.avatar}
                alt="avatar"
                className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
              />
            </div>
          ) : (
            <DefaultProfile height="28px" width="28px" size="20" />
          )}
        </div>

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
