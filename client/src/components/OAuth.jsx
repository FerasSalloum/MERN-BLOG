import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebases";
import {
  useDispatch,
  //  useSelector
} from "react-redux";
import {
  //   signInStart,
  //   signInFaluer,
  signInSuccess,
} from "../app/user/userSlice.js";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        Navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      className="bg-linear-to-br from-pink-500 to-orange-400 text-white cursor-pointer hover:shadow-lg hover:shadow-red-500/50 "
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2 transition-all! ease-in-out! duration-500!" />
      <span>Continue With Google</span>
    </Button>
  );
};

export default OAuth;
