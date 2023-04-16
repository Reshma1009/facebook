import React from "react";
import "./storycard.scss";

const Storycard = ( { user } ) =>
{
  // console.log(user, "userPage");
  return (
    <div className="storyCard">
      <div className="overlay"></div>
      <img src={user.photoURL} alt="" className="storyProfile" />
      <img src={user.photoURL} alt="" className="storybackground" />
      <span className="text">{user.displayName}</span>
    </div>
  );
};

export default Storycard;
