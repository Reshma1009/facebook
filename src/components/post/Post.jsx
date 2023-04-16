import React from "react";
import "./post.scss";
import { Users } from "./../../data";
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

const Post = ({ post }) => {
  console.log("postPage", post);
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
            <span className="postDate">{}</span>
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
            <span className="postLikeCounter">{}</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{} · comments · share</span>
          </div>
        </div>

        <hr className="footerHr" />
        <div className="postBottomFooter">
          <div className="postBottomFooterItem">
            <ThumbUpAltOutlined className="footerIcon" />
            <span className="footerText">Like</span>
          </div>
          <div className="postBottomFooterItem">
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">Comment</span>
          </div>
          <div className="postBottomFooterItem">
            <ShareOutlined className="footerIcon" />
            <span className="footerText">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
