//#region signUp function
// async function signUp() {
//     try {
//       dispatch(signInStart());
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//       });
//       if (error) throw error;

//       // بما أن تأكيد البريد معطّل، سيعود المستخدم مسجلًا ومباشرًا في الجلسة
//       // تأكد من حالة الجلسة:
//       const sessionRes = await supabase.auth.getSession();
//       const signedUser = sessionRes.data.session?.user ?? null;
//       dispatch(signInSuccess(signedUser));
//       alert("Signed up successfully");
//     } catch (err) {
//       alert(err.message ?? "Sign up error");
//       dispatch(signInFaluer(err.message ?? "Sign up error"));
//     }
//   }
//#endregion
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button, TextInput } from "flowbite-react";

// استخدم ANON key هنا (لا تستخدم service_role في المتصفح)
const supabase = createClient(
  "https://xukihcnndjysdmzmitoi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1a2loY25uZGp5c2Rtem1pdG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTQxMjMsImV4cCI6MjA3ODM3MDEyM30.VThfRYI8QpPjzSxcwxmvIh_g-4BKECMXkw3W68R-_Bo"
);

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // جلب الجلسة الحالية
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // الاستماع لتغيرات المصادقة
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      // تنظيف المشترك
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  async function signUp() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // بما أن تأكيد البريد معطّل، سيعود المستخدم مسجلًا ومباشرًا في الجلسة
      // تأكد من حالة الجلسة:
      const sessionRes = await supabase.auth.getSession();
      const signedUser = sessionRes.data.session?.user ?? null;
      setUser(signedUser);
      alert("Signed up successfully");
    } catch (err) {
      alert(err.message ?? "Sign up error");
    } finally {
      setLoading(false);
    }
  }

  async function signIn() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // بعد تسجيل الدخول تلقائيًا ستكون الجلسة متاحة
      const sessionRes = await supabase.auth.getSession();
      const signedUser = sessionRes.data.session?.user ?? null;
      setUser(signedUser);
      alert("Signed in successfully");
    } catch (err) {
      alert(err.message ?? "Sign in error");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Auth</h2>

      <label className="block mb-2">Email</label>
      <TextInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="you@example.com"
      />

      <label className="block mt-3 mb-2">Password</label>
      <TextInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="••••••••"
      />

      <div className="flex gap-2 mt-4">
        <Button onClick={signUp} disabled={loading}>
          {loading ? "Please wait..." : "Sign Up"}
        </Button>
        <Button onClick={signIn} color="success" disabled={loading}>
          {loading ? "Please wait..." : "Sign In"}
        </Button>
        <Button onClick={signOut} color="gray" disabled={!user}>
          Sign Out
        </Button>
      </div>

      {user && (
        <div className="mt-4">
          <strong>Signed in as:</strong> {user.email}
        </div>
      )}
    </div>
  );
}