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
import OAuth from "../components/OAuth";
import { supabase } from "../supabaseClient";

const Signup = () => {
  const customTheme = createTheme({
    spinner: {
      color: {
        custom: "fill-fuchsia-800",
      },
    },
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const handleSupabaseSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // 1. 🔑 التسجيل في Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      const { data, error } =
              await supabase.auth.signInWithPassword({
                email, // استخدام state
                password, // استخدام state
              });
      
            if (error) {
              // إذا فشلت المصادقة في Supabase (نهاية التسلسل بالفشل هنا)
              return (
                setErrorMessage(error.message || "Invalid email or password.")
              );
            }

      if (authError) throw authError;

      const user = authData.user;

      if (!user) {
        // إذا كان تأكيد البريد مفعّلاً
        setErrorMessage("Please check your email to confirm your account.");
        return;
      }

      // 2. 🔄 مزامنة البيانات (Upload/Create) مع MongoDB
      const res = await fetch("http://localhost:3000/api/auth/sync-user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.user_metadata?.full_name || name,
          email: user.email,
          profilePicture: "https://xukihcnndjysdmzmitoi.supabase.co/storage/v1/object/public/imageFile/profilePicture.png",
        }),
      });

      const mongoData = await res.json();

      if (!res.ok || mongoData.success === false) {
        // إذا فشلت المزامنة، يمكنك هنا تسجيل الخروج من Supabase لمنع وجود مستخدم غير متزامن
        await supabase.auth.signOut();
        throw new Error(mongoData.message || "Failed to sync with MongoDB.");
      }

      // 3. ✅ نجاح: التوجيه (يمكنك هنا أيضاً إرسال إجراء Redux إذا كنت تستخدمه)
      
      Navigate("/");
    } catch (err) {
      setErrorMessage(err.message ?? "Sign up error");
    } finally {
      setLoading(false);
    }
  };
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
            this is a demo project. you can sing up with your email and password
            or with google
          </p>
        </div>
        {/* rigth */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSupabaseSignup}>
            <div>
              <Label>your username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="name"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                <span className="text-lg">Singn Up</span>
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Singn in{" "}
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">Info alert!</span>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
