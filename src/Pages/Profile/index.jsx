import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";

export default function Profile() {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      const response = await fetch("/api/user-profile", {
        method: "GET",
        //   body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://chatnexa.onrender.com/",
        },
        credentials: "include",
      });
      const result = await response.json();

      setUser(result);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <section>
      {user ? (
        user.name
      ) : (
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
    </section>
  );
}
