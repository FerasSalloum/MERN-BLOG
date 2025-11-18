import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  signInSuccess,
  signInStart,
  signInFaluer,
} from "../app/user/userSlice.js";

const SupabaseAuthListener = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          session &&
          (event === "INITIAL_SESSION" ||
            event === "SIGNED_IN" ||
            event === "SIGNED_IN_REDIRECTED")
        ) {
          const user = session.user;
          dispatch(signInStart());
          fetch("http://localhost:3000/api/auth/sync-user-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.user_metadata?.full_name || user.email.split("@")[0],
              email: user.email,
              profilePicture:
                "https://xukihcnndjysdmzmitoi.supabase.co/storage/v1/object/public/imageFile/profilePicture.png",
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success === false) {
                dispatch(signInFaluer(data.message));
                navigate("/sign-in");
              } else {
                dispatch(signInSuccess(data));
                if (
                  window.location.pathname === "/sign-in" ||
                  window.location.pathname === "/sign-up"
                ) {
                  navigate("/");
                }
              }
            })
            .catch((error) => {
              console.error("خطأ في API Backend:", error);
              dispatch(signInFaluer("فشل الاتصال بالخادم بعد المصادقة."));
              navigate("/sign-in");
            });
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, navigate]);
  return children;
};
export default SupabaseAuthListener;
