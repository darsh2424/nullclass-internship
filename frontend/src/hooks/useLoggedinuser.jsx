import { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

export default function useLoggedinuser() {
  const { user, setUserDetails } = useUserAuth();
  const [loggedinuser, setLoggedinuser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/loggedinuser?email=${user.email}`);

        if (res.ok) {
          const data = await res.json();
          setLoggedinuser(data);
          setUserDetails(data);
        } else if (res.status === 404) {
          const newUser = {
            username: user.email.split('@')[0],
            name: user.displayName || "No Name",
            email: user.email,
            password: null,
          };

          const createRes = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
          });

          const createdUser = await createRes.json();

          if (createRes.ok) {
            setUserDetails(createdUser);
            setLoggedinuser(createdUser);
          } else {
            console.error("Error saving Google user to DB:", createdUser);
            setUserDetails(null);
          }
        } else {
          const errorText = await res.text();
          console.error("Unexpected response:", res.status, errorText);
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
        setLoggedinuser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  return [loggedinuser, setLoggedinuser, loading, setUserDetails];
}
