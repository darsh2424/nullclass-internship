import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firbase";

const userAuthContext = createContext();

export function UserAuthContextProvider(props) {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => userCredential.user)
            .catch((error) => {
                console.log(error.code, error.message);
                throw error;
            });
    }

    function logOut() {
        setUser(null);
        setUserDetails(null);
        return signOut(auth);
    }

    function googleSignIn() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function setManualUser(email, details = null) {
        setUser({ email });
        setUserDetails(details);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
            setUser(currentuser);

            if (currentuser?.email) {
                try {
                    // 🔁 Standardizing to query-based fetch
                    const res = await fetch(`http://localhost:5000/loggedinuser?email=${currentuser.email}`);

                    if (res.ok) {
                        const data = await res.json();
                        setUserDetails(data);
                    } else if (res.status === 404) {

                        const username = currentuser.email ? currentuser.email.split('@')[0] : null;
                        const email = currentuser.email || null;
                        const name = currentuser.displayName || "No Name";

                        if (!email || !username) {
                            console.error("Missing email or username — cannot register user");
                            return;
                        }

                        const newUser = {
                            username,
                            name,
                            email,
                            password: null,
                            followers: [],
                            followings: [],
                            bio: null,
                            dob: null,
                            location: null,
                            website: null,
                            profileImage: currentuser.photoURL || null,
                            coverImage: null,
                            dailyPostInfo: {
                                date: new Date().toISOString().split('T')[0],
                                count: 0,
                            },
                            lastPostAt: null,
                            createdAt: new Date(),
                        };

                        const createRes = await fetch("http://localhost:5000/register", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(newUser),
                        });

                        if (createRes.ok) {
                            const createdUser = await createRes.json();
                            setUserDetails(createdUser);
                        } else {
                            const errorText = await createRes.text();
                            console.error("Error saving Google user to DB:", errorText);
                            setUserDetails(null);
                        }
                    } else {
                        const errText = await res.text();
                        console.error("Unexpected response:", res.status, errText);
                        setUserDetails(null);
                    }
                } catch (err) {
                    console.error("Error during Google sign-in fetch/register:", err);
                    setUserDetails(null);
                }
            } else {
                setUserDetails(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <userAuthContext.Provider
            value={{
                user,
                userDetails,
                setUserDetails,
                logIn,
                signUp,
                logOut,
                googleSignIn,
                setManualUser,
            }}
        >
            {props.children}
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}
