import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient"; // عدّل المسار حسب مشروعك
import { useSelector } from "react-redux";

export default function TestDashProfileUpload({
  bucket = "imageFile",
  filename = "profile_avatar.jpg",
  makePublic = false, // true => يتوقع bucket عام ويرجع public URL
  signedUrlExpiry = 60, // ثواني لصلاحية signed URL إن كان خاص
}) {
  const [file, setFile] = useState(null);
  //   const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);
  //   const [error, setError] = useState(null);
  //   const [loading, setLoading] = useState(false);
  const fillePikerRef = useRef();
  const { currentUser } = useSelector((state) => state.user);

  const getCurrentUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user || null;
    } catch (err) {
      console.error("getUser error", err);
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const f = (await e.target.files[0]) || null;
    setFile(f);
    setUrl(null);
  };

  const upload = async () => {
    setUrl(null);

    if (!file) {
      console.log("اختر ملفاً أولاً");
      return;
    }

    // بسيط: تأكد أن النوع صورة
    if (!file.type.startsWith("image/")) {
      console.log("الملف يجب أن يكون صورة.");
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        throw new Error(
          "المستخدم غير مسجل الدخول. الرجاء تسجيل الدخول ثم المحاولة."
        );
      }

      const userId = user.id;
      const filePath = `${userId}/${filename}`;

      // رفع الملف (upsert => true لتحديث الصور إن لزم)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("uploadError raw:", uploadError);
        // خاص بـ RLS غالبًا سيرجع خطأ له نفس الرسالة
        throw new Error(uploadError.message || "خطأ أثناء رفع الملف");
      }

      // إذا طلبنا public URL (لـ public bucket)
      if (makePublic) {
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (publicUrlError) {
          console.warn("getPublicUrl error:", publicUrlError);
          // نتابع للمحاولة بسigned URL
        } else if (publicUrlData?.publicUrl) {
          setUrl(publicUrlData.publicUrl);
          return;
        }
      }

      // افتراضي: نطلب signed URL (للـ private buckets)
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, signedUrlExpiry);

      if (signedError) {
        console.error("createSignedUrl error:", signedError);
        throw new Error(signedError.message || "خطأ في إنشاء رابط مؤقت");
      }

      setUrl(signedData?.signedUrl || null);
    } catch (err) {
      console.error("Upload failed:", err);
      // تحويل الأخطاء المختلفة لرسالة مفهومة
      if (
        err.message?.includes("row-level security") ||
        err.message?.includes("violates row-level security")
      ) {
        console.log(
          "فشل الرفع: سياسة RLS تمنع إنشاء الصفوف. تحقق من سياسات التخزين أو جرب bucket عام."
        );
      } else {
        console.log(err.message || "حدث خطأ أثناء الرفع.");
      }
    }
  };
  useEffect(() => {
    upload();
  }, [file, currentUser?.id]);
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fillePikerRef}
        hidden
      />
      <div
        className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
        onClick={() => {
          fillePikerRef.current.click();
        }}
      >
        <img
          src={url || currentUser.profilePicture}
          alt="user"
          className="rounded-full w-full h-full object-cover border-6 border-gray-300"
        />
      </div>
    </>
  );
}
