//#region
// import {
//   Button,
//   Label,
//   TextInput,
//   Alert,
//   Spinner,
//   createTheme,
//   ThemeProvider,
// } from "flowbite-react";
// import { HiInformationCircle } from "react-icons/hi";
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   signInStart,
//   signInFaluer,
//   signInSuccess,
// } from "../app/user/userSlice.js";
// import OAuth from "../components/OAuth.jsx";

// const Signin = () => {
//   const { loading, error } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const Navigate = useNavigate();
//   const [formData, setFormData] = useState({});
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
//   };
//   const handelSumit = async (e) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       // return setError("please fill out all fields.");
//       return dispatch(signInFaluer("please fill out all fields."));
//     }
//     try {
//       dispatch(signInStart());
//       const res = await fetch("http://localhost:3000/api/auth/sign-in", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (data.success == false) {
//         return dispatch(signInFaluer(data.message));
//       }
//       if (res.ok) {
//         dispatch(signInSuccess(data));
//         Navigate("/");
//       }
//     } catch (error) {
//       dispatch(signInFaluer(error));
//     }
//   };
//   const customTheme = createTheme({
//     spinner: {
//       color: {
//         custom: "fill-fuchsia-800",
//       },
//     },
//   });
//   return (
//     <div className="min-h-screen mt-20 ">
//       <div className="flex p-3 max-w-2xl mx-auto flex-col md:flex-row md:items-center gap-5 lg:max-w-4xl">
//         {/* left */}
//         <div className="flex-1">
//           <Link to="/" className="font-bold text-black text-4xl  dark:text-white">
//             <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
//               Feras's
//             </span>
//              Blog
//           </Link>
//           <p className="text-sm mt-5">
//             this is a demo project. you can sing im with your email and password
//             or with google
//           </p>
//         </div>
//         {/* rigth */}
//         <div className="flex-1">
//           <form className="flex flex-col gap-4" onSubmit={handelSumit}>
//             {/* <div>
//               <Label>your username</Label>
//               <TextInput
//                 id="username"
//                 type="text"
//                 placeholder="name"
//                 required
//                 onChange={handleChange}
//               />
//             </div> */}
//             <div>
//               <Label>your email</Label>
//               <TextInput
//                 id="email"
//                 type="email"
//                 placeholder="name@email.com"
//                 required
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>your password</Label>
//               <TextInput
//                 id="password"
//                 type="password"
//                 placeholder="*********"
//                 required
//                 onChange={handleChange}
//               />
//             </div>
//             <Button
//               className="SingnB cursor-pointer hover:shadow-lg hover:shadow-[#8490fa]"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <ThemeProvider theme={customTheme}>
//                     <Spinner color="custom" size="md" className="mr-5" />
//                   </ThemeProvider>
//                   <span className="text-lg">Loading...</span>
//                 </>
//               ) : (
//                 <span className="text-lg">Singn In</span>
//               )}
//             </Button>
//             <OAuth/>
//           </form>
//           <div className="flex gap-2 text-sm mt-5">
//             <span>Dont Have an account?</span>
//             <Link to="/sign-up" className="text-blue-500">
//               Singn up{" "}
//             </Link>
//           </div>
//           {error && (
//             <Alert color="failure" icon={HiInformationCircle}>
//               <span className="font-medium">Info alert!</span>
//               {error}
//             </Alert>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;
//#endregion
import {
  Button,
  Label,
  TextInput,
  Alert,
  Spinner,
  createTheme,
  ThemeProvider,
} from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFaluer,
  signInSuccess,
} from "../app/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";
import { supabase } from "../supabaseClient";

const Signin = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.user);
  
  const handleSignInAndSync = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      // استخدام email و password مباشرة
      return dispatch(signInFaluer("Please fill out all fields."));
    }

    dispatch(signInStart());

    try {
      // 1. 🔑 المصادقة (Auth) باستخدام Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email, // استخدام state
        password, // استخدام state
      });

      if (error) {
        // إذا فشلت المصادقة في Supabase (نهاية التسلسل بالفشل هنا)
        return dispatch(
          signInFaluer(error.message || "Invalid email or password.")
        );
      }

      const user = data.user;

      // 2. 🔄 مزامنة البيانات (Store & Upload) مع MongoDB
      // الخادم الوسيط سيقوم بإنشاء أو تحديث السجل في MongoDB
      const res = await fetch("http://localhost:3000/api/auth/sync-user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // نستخدم بيانات Supabase للمزامنة
          // name: user.user_metadata?.full_name || user.email.split("@")[0],
          email: user.email,
          credentials: true,
          googlePhotoUrl:
            user.user_metadata?.avatar_url || user.avatar_url || null,
        }),
      });

      const mongoData = await res.json();

      if (!res.ok || mongoData.success === false) {
        // إذا فشلت المزامنة في الخادم الوسيط بعد نجاح المصادقة في Supabase
        // يفضل تسجيل الخروج من Supabase هنا لضمان حالة نظيفة
        await supabase.auth.signOut();
        return dispatch(
          signInFaluer(
            mongoData.message || "Failed to sync user data with MongoDB."
          )
        );
      }

      // 3. ✅ نجاح: تحديث Redux store والتوجيه
      dispatch(signInSuccess(mongoData));
      Navigate("/");
    } catch (error) {
      console.error("Sign-in/Sync Error:", error);
      dispatch(
        signInFaluer(
          error.message || "An unexpected error occurred during sign-in."
        )
      );
    }
  };
  const customTheme = createTheme({
    spinner: {
      color: {
        custom: "fill-fuchsia-800",
      },
    },
  });

  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-3 max-w-2xl mx-auto flex-col md:flex-row md:items-center gap-5 lg:max-w-4xl">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold text-black text-4xl  dark:text-white"
          >
            <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Feras's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            this is a demo project. you can sing im with your email and password
            or with google
          </p>
        </div>
        {/* rigth */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSignInAndSync}>
            <div>
              <Label>your email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@email.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>your password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="*********"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="SingnB cursor-pointer hover:shadow-lg hover:shadow-[#8490fa]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ThemeProvider theme={customTheme}>
                    <Spinner color="custom" size="md" className="mr-5" />
                  </ThemeProvider>
                  <span className="text-lg">Loading...</span>
                </>
              ) : (
                <span className="text-lg">Singn In</span>
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Singn up
            </Link>
          </div>
          {error && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">Info alert!</span>
              {error}
            </Alert>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Signin;
