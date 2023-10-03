import React, { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import DefaultProfile from "../DefaultProfile";

function ModalContainer({ children, user, isModalOpen, setIsModalOpen }) {
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log(isModalOpen, "modal");
  }, [isModalOpen]);

  return (
    <>
      <div onClick={openModal} className="" key={user?._id + isModalOpen}>
        {children}
      </div>
      {/* <div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-800 opacity-50"></div>
            <div className="relative md:w-[40vw] w-[85vw] bg-white pt-2 rounded-lg shadow-lg">
              <IoCloseCircle
                onClick={() => setIsModalOpen(false)}
                size={24}
                className="absolute rounded-full bg-white -top-2 -right-2 text-gray-600 hover:text-gray-800 transition duration-300 cursor-pointer hover:scale-105"
              />

              <div className="w-full">
                <div className="text-lg tracking-wider font-semibold px-6">
                  {user.name}
                </div>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-auto w-full"
                  />
                ) : (
                  <DefaultProfile height="100px" width="100px" size="60" />
                )}
                {console.log(user, "user")}
                {user.bio && (
                  <div className="text-sm tracking-wider w-full px-6 py-2">
                    {"Bio: " + user.bio}
                  </div>
                )}
                {user.email && (
                  <div className="text-sm tracking-wider w-full px-6 py-2">
                    {"Email: " + user.email}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div> */}
    </>
  );
}

export default ModalContainer;
