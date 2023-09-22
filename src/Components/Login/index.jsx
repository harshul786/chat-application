import { useState } from "react";
import { Dna } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/chatProvider";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = ChatState();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    let data = { email, password };

    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.warn("Please Fill all the Feilds", {
        autoClose: 5000,
        position: "bottom-right",
        theme: "dark",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();

      // props.setUser(result.user);
      if (response.ok) {
        toast("Logged in!", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
        });
        localStorage.setItem("userInfo", JSON.stringify(result.user));
        setUser(result.user);

        navigate("/chats");
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      toast.error("Please enter correct email or password!", {
        autoClose: 5000,
        position: "bottom-right",
        theme: "dark",
      });
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-[90vh] lg:py-0">
        {isLoading && (
          <div className="p-10 bg-black/25 rounded-2xl absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2">
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        )}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@gmail.com"
                  required=""
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <div
                  // href="/reset-passowrd"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-white"
                >
                  Forgot password?
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white ${
                  isLoading ? "bg-blue-400 hover:bg-blue-400" : ""
                } bg-blue-600 hover:bg-blue-800 duration-150 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
              >
                Sign in
              </button>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400 flex justify-between cursor-pointer">
                <p>Don’t have an account yet? </p>
                <div
                  onClick={() => props.setPage(1)}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
