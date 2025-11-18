//#region بواسطة فاير باس
// import { Button } from "flowbite-react";
// import React from "react";
// import { AiFillGoogleCircle } from "react-icons/ai";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { app } from "../firebases";
// import { useDispatch } from "react-redux";
// import { signInSuccess } from "../app/user/userSlice.js";
// import { useNavigate } from "react-router-dom";
// const OAuth = () => {
//   const dispatch = useDispatch();
//   const Navigate = useNavigate();
//   const auth = getAuth(app);
//   const handleGoogleClick = async () => {
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({ prompt: "select_account" });
//     try {
//       const resultsFromGoogle = await signInWithPopup(auth, provider);
//       const res = await fetch("http://localhost:3000/api/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: resultsFromGoogle.user.displayName,
//           email: resultsFromGoogle.user.email,
//           googlePhotoUrl: resultsFromGoogle.user.photoURL,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         await dispatch(signInSuccess(data));
//         Navigate("/");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <Button
//       type="button"
//       className="bg-linear-to-br from-pink-500 to-orange-400 text-white cursor-pointer hover:shadow-lg hover:shadow-red-500/50 "
//       onClick={handleGoogleClick}
//     >
//       <AiFillGoogleCircle className="w-6 h-6 mr-2 transition-all! ease-in-out! duration-500!" />
//       <span>Continue With Google</span>
//     </Button>
//   );
// };

// export default OAuth;
//#endregion
import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
// 🛑 استبدال استيرادات Firebase بـ Supabase
import { supabase } from "../supabaseClient"; // تأكد من مسار ملف التهيئة
// لم نعد نحتاج إلى useDispatch أو useNavigate في هذا المكون

const OAuth = () => {
  const handleGoogleClick = async () => {
    try {
      // 1. استدعاء دالة تسجيل الدخول عبر Google OAuth من Supabase
      // Supabase سيعيد توجيه المستخدم لصفحة جوجل للمصادقة.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // 2. الرابط الذي سيعود إليه المستخدم بعد المصادقة
          // سنستخدم الرابط الأساسي للتطبيق. عند العودة، سيقوم Auth Listener بمعالجة الأمر.
          // يجب أن يكون هذا الرابط مضافاً إلى Authorized redirect URIs في Google Cloud إذا كان مساراً فريداً.
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("Supabase Google Auth Error:", error);
        // لا حاجة لـ Navigate هنا لأن المتصفح سيعيد توجيهه إلى جوجل
      }
    } catch (error) {
      console.error("خطأ عام في المصادقة:", error);
    }
  };

  return (
    <Button
      type="button" // مهم جداً: لتجنب إرسال النموذج الأساسي
      className="bg-linear-to-br from-pink-500 to-orange-400 text-white cursor-pointer hover:shadow-lg hover:shadow-red-500/50 "
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2 transition-all! ease-in-out! duration-500!" />
      <span>Continue With Google</span>
    </Button>
  );
};

export default OAuth;
