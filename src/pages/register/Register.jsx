import React, { useState } from "react";
import "./register.scss";
import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase.confige";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const Register = () => {
  const [img, setImg] = useState(null);
  let handleSubmit = (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        const storageRef = ref(storage, "usersImg/" +displayName);

        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateProfile(user, {
                  displayName,
                  photoURL: downloadURL,
                });
                // Add a new document in collection "users"
                await setDoc(doc(db, "users", user.uid), {
                  uid: user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                } );
                await setDoc(doc(db, "usersPost", user.uid), {
                  message: [],
                });
              }
            );
          }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(error);
      });
  };
  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">FaceBook</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on Facebook.
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <div className="top">
              <img
                src={
                  img
                    ? URL.createObjectURL(img)
                    : "/assets/profileCover/DefaultProfile.jpg"
                }
                alt=""
                className="profileImg"
              />
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlined className="icon" />
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    style={{ display: "none" }}
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleSubmit} className="bottomBox">
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="registerInput"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="registerInput"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="registerInput"
                  required
                />
                {/*  <input
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPasword"
                  className="registerInput"
                  required
                /> */}
                <button type="submit" className="registerButton">
                  Sign Up
                </button>
                <Link to="/login">
                  <button className="loginRegisterButton">
                    Log into Account
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
