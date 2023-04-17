import React, { useState, useContext, useEffect } from "react";
import "./post.scss";
import { IconButton } from "@mui/material";
import {
  ChatBubbleOutline,
  MoreVert,
  Favorite,
  ThumbUp,
  ThumbUpAltOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase.confige";
import { AuthContext } from "../../context/AuthContext";
const Post = ({ post }) => {
  console.log("postPage", post);
  const { currentUser } = useContext(AuthContext);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [commentBox, setCommentBox] = useState(false);
  const [commentArea, setCommentArea] = useState(false);
  const [comments, setComments] = useState("");
  const [showComments, setShowComments] = useState([]);

  // Comments part
  let sendComment = async () => {
    await addDoc(collection(db, "posts", post.id, "comments"), {
      comments,
      userName: currentUser.displayName,
      uid: currentUser.uid,
      photoURL: currentUser.photoURL,
      timeStamp: serverTimestamp(),
    });
    setComments("");
    setCommentBox(false);
  };
  let handleComment = (e) => {
    setComments(e.target.value);
  };

  // show the comments
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", post.id, "comments"),
      (snapshot) => {
        setShowComments(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            commentId: doc.id,
          }))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [post.id]);
  console.log("showComments", showComments);

  // this one add collection for likes
  let handleLike = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", post.id, "likes", currentUser.uid));
    } else {
      await setDoc(doc(db, "posts", post.id, "likes", currentUser.uid), {
        userId: currentUser.uid,
      });
    }
    console.log(post.id);
  };
  // this one is set likes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", post.id, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [post.id]);
  // this one for delete likes
  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id == currentUser.uid) != -1);
  }, [likes, currentUser.uid]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to="/profile/userId">
              <img
                src={
                  // Users.filter((u) => u.id === post.userId)[0].profilePicture
                  post.photoURL
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">
              {/* {Users.filter((u) => u.id === post.userId)[0].username} */}
              {post.name}
            </span>
            <span className="postDate">
              <TimeAgo
                date={new Date(post.timeStamp?.toDate()).toLocaleString()}
              />
            </span>
          </div>
          <div className="postTopRight">
            <IconButton>
              <MoreVert className="postVertButton" />
            </IconButton>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.mess}</span>
          <img src={post.photo} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite className="bottomLeftIcon" style={{ color: "red" }} />
            <ThumbUp className="bottomLeftIcon" style={{ color: "#011631" }} />
            {likes.length > 0 && (
              <span className="postLikeCounter">
                {likes.length} People Likes
              </span>
            )}
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {showComments.length > 0 && <span>{showComments.length}</span>}
              <span onClick={() => setCommentArea(!commentArea)}>
                {" "}
                comments{" "}
              </span>
              · share
            </span>
          </div>
        </div>

        <hr className="footerHr" />
        <div className="postBottomFooter">
          <div onClick={handleLike} className="postBottomFooterItem">
            {liked ? (
              <ThumbUp className="footerIcon" />
            ) : (
              <ThumbUpAltOutlined className="footerIcon" />
            )}

            <span className="footerText">Like</span>
          </div>
          <div
            onClick={() => {
              setCommentBox(!commentBox), setComments("");
            }}
            className="postBottomFooterItem"
          >
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">Comment</span>
          </div>
          <div className="postBottomFooterItem">
            <ShareOutlined className="footerIcon" />
            <span className="footerText">Share</span>
          </div>
        </div>
      </div>
      {commentBox && (
        <div className="commentBox">
          <textarea
            onChange={handleComment}
            type="text"
            value={comments}
            className="commentInput"
            rows={2}
          />
          <button
            onClick={sendComment}
            disabled={!comments}
            className="sendCommentBtn"
          >
            comment
          </button>
        </div>
      )}
      {commentArea && (
        <>
          {showComments
            .sort((a, b) => b.timeStamp - a.timeStamp)
            .map((com) => (
              <div className="comments-wrapper">
                <img className="commentImg" src={currentUser.photoURL} alt="" />
                <div className="comment_detail">
                  <div className="name-date">
                    <p className="name">{com.userName}</p>
                    <p className="date">
                      <TimeAgo
                        date={new Date(
                          com.timeStamp?.toDate()
                        ).toLocaleString()}
                      />
                    </p>
                  </div>
                  <p className="comment">{com.comments}</p>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Post;
