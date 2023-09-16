import { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import Loading from "../Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultProfile from "../DefaultProfile";

export default function Profile() {
  const { user, setUser } = ChatState();
  const [unsavedUser, setUnsavedUser] = useState(user);
  const [changesMade, setChangesMade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openFileInput = () => {
    document.getElementById("avatar").click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file?.size > 1024 * 1024) {
      toast.error("Please Upload file of less than 1MB", {
        position: "bottom-left",
        autoClose: 5000,
        theme: "dark",
      });
    } else if (file) {
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,

          credentials: "include",
        });
        const responseData = await response.json();
        if (response.ok) {
          toast("Avatar Uploaded!", {
            position: "bottom-left",
            autoClose: 5000,
            theme: "dark",
          });
          setUser({ ...user, avatar: responseData.img });
          localStorage.setItem(
            "userInfo",
            localStorage
              .getItem("userInfo")
              .replace(user.avatar, responseData.img)
          );
          console.log(localStorage.getItem("userInfo"));
        } else {
          toast.error(responseData.error, {
            position: "bottom-left",
            autoClose: 5000,
            theme: "dark",
          });
        }
      } catch (error) {
        toast.error("Error uploading avatar.", {
          position: "bottom-left",
          autoClose: 5000,
          theme: "dark",
        });
      }
    }
  };

  const handleNameChange = (e) => {
    setUnsavedUser({ ...unsavedUser, name: e.target.value });
    setChangesMade(true);
  };

  const handleBioChange = (e) => {
    setUnsavedUser({ ...unsavedUser, bio: e.target.value });
    setChangesMade(true);
  };

  const handleEmailChange = (e) => {
    setUnsavedUser({ ...unsavedUser, email: e.target.value });
    setChangesMade(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/edit-profile", {
        method: "PUT",
        body: JSON.stringify(unsavedUser),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        toast("Changes Saved!", {
          position: "bottom-left",
          autoClose: 5000,
          theme: "dark",
        });
        localStorage.setItem("userInfo", JSON.stringify(unsavedUser));
        setUser(unsavedUser);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.error, {
        position: "bottom-left",
        autoClose: 5000,
        theme: "dark",
      });
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/signout", {
        method: "POST",
        // body: JSON.stringify(unsavedUser),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged Out!", {
          position: "top-left",
          autoClose: 5000,
          theme: "dark",
        });

        setUser(null);
        localStorage.removeItem("userInfo");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        position: "top-left",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex flex-col w-full dark:text-white">
      <ToastContainer />
      {isLoading && <Loading />}
      <div className="mt-4 block ml-auto mr-auto">
        {user.avatar ? (
          <div className="w-24 h-24 overflow-hidden rounded-full relative">
            <img
              src={user.avatar}
              alt="avatar"
              className="h-full w-auto object-cover absolute top-0 left-1/2 -translate-x-1/2"
            />
          </div>
        ) : (
          <DefaultProfile height="100px" width="100px" size="60" />
        )}
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <div
          className="text-center mt-3 text-sm text-blue-500"
          onClick={openFileInput}
        >
          {"Edit"}
        </div>
      </div>
      <div className="mt-4 mx-4 text-sm flex flex-col gap-5">
        <section>
          <div className="pl-4 text-xs">NAME</div>
          <input
            value={unsavedUser.name}
            className="bg-gray-100 dark:bg-gray-900 px-4 py-1 rounded-lg w-full tracking-wider"
            onChange={handleNameChange}
          />
        </section>
        <section>
          <div className="pl-4 text-xs">BIO</div>
          <input
            value={unsavedUser.bio}
            placeholder={"Add a bio!"}
            className={`${
              unsavedUser.bio ? "" : "dark:text-gray-200 text-gray-400"
            } bg-gray-100 dark:bg-gray-900 px-4 py-1 rounded-lg w-full tracking-wider`}
            onChange={handleBioChange}
          />
        </section>
        <section>
          <div className="pl-4 text-xs">EMAIL</div>
          <input
            value={unsavedUser.email}
            className="bg-gray-100 dark:bg-gray-900 px-4 py-1 rounded-lg w-full tracking-wider"
            onChange={handleEmailChange}
          />
          <div
            className={`pl-4 text-xs tracking-wider mt-1 w-max ${
              unsavedUser.isVerified
                ? "text-green-500"
                : "text-yellow-500 cursor-pointer hover:underline"
            }`}
          >
            {unsavedUser.isVerified ? "Verified" : "Please Verify your email!"}
          </div>
        </section>
        {changesMade && (
          <button
            className="dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer hover:scale-y-110 hover:bg-gray-200 font-medium bg-gray-100 text-center text-blue-500 px-4 py-1 rounded-lg w-full tracking-wider"
            onClick={() => {
              // Make API call to save the changes
              handleSave();
              setChangesMade(false); // Reset changesMade after saving
            }}
          >
            Save
          </button>
        )}
        <button
          onClick={handleLogout}
          className="dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer hover:scale-y-110 hover:bg-gray-200 font-medium bg-gray-100 text-center text-red-500 px-4 py-1 rounded-lg w-full tracking-wider"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
