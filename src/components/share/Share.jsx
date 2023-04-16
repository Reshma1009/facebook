import React, { useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../context/AuthContext";
import {
  Close,
  EmojiEmotions,
  PermMedia,
  VideoCameraFront,
} from "@mui/icons-material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./share.scss";
import { db, storage } from "../../firebase.confige";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";
const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  console.log("sharepage", currentUser);
  const [ img, setImg ] = useState( null );
   let handleEmojiSend = (e) => {
     console.log(e.emoji);
     setInput(input + e.emoji);
   };
  let handlePost = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        (error) => {
          // Handle unsuccessful uploads
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(collection(db, "posts"), {
              uid: currentUser.uid,
              name: currentUser.displayName,
              photoURL: currentUser.photoURL,
              mess: input,
              img: downloadURL,
              timeStamp: serverTimestamp(),
            });
            await updateDoc(doc(db, "usersPost", currentUser.uid), {
              message: arrayUnion({
                id: uuid(),
                uid: currentUser.uid,
                name: currentUser.displayName,
                photoURL: currentUser.photoURL,
                mess: input,
                img: downloadURL,
                timeStamp: Timestamp.now(),
              }),
            });
          });
        }
      );
    } else {
      await addDoc(collection(db, "posts"), {
        uid: currentUser.uid,
        name: currentUser.displayName,
        photoURL: currentUser.photoURL,
        mess: input,
        timeStamp: serverTimestamp(),
      });
      await updateDoc(doc(db, "usersPost", currentUser.uid), {
        message: arrayUnion({
          id: uuid(),
          uid: currentUser.uid,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          mess: input,
          timeStamp: Timestamp.now(),
        }),
      });
    }
    setInput("");
    setImg( null );
    setShowEmoji(false)
  };
  console.log(uuid());
  let handleKey = (e) => {
    e.code === "Enter" && handlePost();
  };
  const removeImage = () => {
    setImg(null);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={currentUser && currentUser.photoURL}
            alt=""
            className="shareProfileImg"
          />
          <textarea
            type="text"
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder={`What's on your mind ${
              currentUser && currentUser.displayName
            } ?`}
            className="shareInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKey} // its basically work at send post or submit post
          />
        </div>
        <hr className="shareHr" />
        {img && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(img)} alt="" className="shareImg" />
            <Close className="shareCancelImg" onClick={removeImage} />
          </div>
        )}
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <VideoCameraFront
                className="shareIcon"
                style={{ color: "#bb0000f2" }}
              />
              <span className="shareOptionText">Live Video</span>
            </div>
            <label htmlFor="file" className="shareOption">
              <PermMedia className="shareIcon" style={{ color: "#2e0196f1" }} />
              <span className="shareOptionText">Photo/Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                style={{ display: "none" }}
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            <div
              onClick={() => setShowEmoji(!showEmoji)}
              className="shareOption"
            >
              <EmojiEmotions
                className="shareIcon"
                style={{ color: "#bfc600ec" }}
              />

              <span className="shareOptionText">Feelings/Activity</span>
            </div>
          </div>
        </div>
        {showEmoji && (
          <div>
            <EmojiPicker onEmojiClick={ handleEmojiSend } />
          </div>
        )}
      </div>
    </div>
  );
};

export default Share;
