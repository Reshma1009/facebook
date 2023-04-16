import React, { useState, useEffect } from "react";
import { Posts } from "../../data";
import Post from "../post/Post";
import Share from "../share/Share";
import Stories from "../stories/Stories";
import "./feed.scss";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.confige";
const Feed = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id,  ...doc.data() })));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Stories />
        <Share />
        {posts
          .sort((a, b) => b.timeStamp - a.timeStamp)
          .map((p) => (
            <Post key={p.id} post={p} />
          ))}
      </div>
    </div>
  );
};

export default Feed;
