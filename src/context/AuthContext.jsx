import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase.confige";
import { onAuthStateChanged } from "firebase/auth";
export const AuthContext = createContext();

// Create our provider

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    let unSub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unSub();
    };
  }, []);
  console.log("currentUser", currentUser);
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
