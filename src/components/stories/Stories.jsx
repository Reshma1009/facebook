import React, { useContext, useEffect, useState } from "react";
import Storycard from "../storycard/Storycard";
// import { Users } from "../../data";
import "./stories.scss";
import { AuthContext } from "../../context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.confige";
const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  // const usersRef = collection(db, "users");
console.log(currentUser);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("uid", "!=", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUserData();
  }, []);
  console.log(users);

  return (
    <div className="stories">
      <div className="storyCard">
        <div className="overlay"></div>
        <img
          src={currentUser && currentUser.photoURL}
          alt=""
          className="storyProfile"
        />
        <img
          src={currentUser && currentUser.photoURL}
          alt=""
          className="storybackground"
        />
        <img src="/assets/person/upload.png" alt="" className="storyadd" />
        <span className="text">{currentUser.displayName}</span>
      </div>

      {users.map((u) => (
        <Storycard key={u.id} user={u} />
      ))}
    </div>
  );
};

export default Stories;
