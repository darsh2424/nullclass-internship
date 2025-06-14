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
        const data = await res.json();
        setLoggedinuser(data[0] || null);
        setUserDetails(data[0] || null);
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
