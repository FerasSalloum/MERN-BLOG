//#region  الكود القديم
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector, useDispatch } from "react-redux";
import { updateSuccess } from "../app/user/userSlice"; //
import { Spinner } from "flowbite-react";

export default function DashProfileUpload({
  bucket = "imageFile",
  filename = `profile_avatar ${+Math.random().toString(9).slice(-4)}.jpg`,
  makePublic = true,
  signedUrlExpiry = 60,
}) {
  const [file, setFile] = useState(null);
  const [loding, setLoadeing] = useState(false);
  const [url, setUrl] = useState(null);
  const fillePikerRef = useRef();
  const dispatch = useDispatch();
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
    setFile(null);
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
    if (!file.type.startsWith("image/")) {
      console.log("الملف يجب أن يكون صورة.");
      return;
    }
    let finalUrl = null;
    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        throw new Error(
          "المستخدم غير مسجل الدخول. الرجاء تسجيل الدخول ثم المحاولة."
        );
      }
      const userId = user.id;
      const filePath = `${userId}/profile_avatar/${filename}`;
      const folderPath = `${userId}/profile_avatar`;
      setLoadeing(true);
      // 1) نجمع كل الملفات داخل المجلد profile_avatar
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(folderPath, { limit: 1000 });

      if (listError) {
        console.error("Error listing folder:", listError);
        setLoadeing(false);
        return { success: false, error: listError };
      }

      if (files && files.length > 0) {
        const paths = files.map((f) => `${folderPath}/${f.name}`);
        const { error: removeError } = await supabase.storage
          .from(bucket)
          .remove(paths);
        if (removeError) {
          console.error("Error removing files:", removeError);
          setLoadeing(false);
          return { success: false, error: removeError };
        }
        console.log("All files in folder removed:", paths);
      } else {
        console.log("Folder empty or does not exist:", folderPath);
      }
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });
      console.log(uploadData);
      if (uploadError) {
        console.error("uploadError raw:", uploadError);
        throw new Error(uploadError.message || "خطأ أثناء رفع الملف");
      }

      if (makePublic) {
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        if (publicUrlError) {
          console.warn("getPublicUrl error:", publicUrlError);
        } else if (publicUrlData?.publicUrl) {
          setUrl(publicUrlData.publicUrl);
          finalUrl = publicUrlData.publicUrl;
          console.log(finalUrl);
        }
      }
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, signedUrlExpiry);
      if (signedError) {
        console.error("createSignedUrl error:", signedError);
        throw new Error(signedError.message || "خطأ في إنشاء رابط مؤقت");
      }
      setUrl(signedData?.signedUrl || null);
      if (finalUrl) {
        await updateProfilePictureInDB(finalUrl);

        // 💡 الإبقاء على كسر التخزين المؤقت (Cache Buster) كإجراء وقائي
        const urlWithCacheBuster = `${finalUrl}?t=${Date.now()}`;

        setUrl(urlWithCacheBuster);
      } else {
        throw new Error("فشل الحصول على رابط الصورة النهائي.");
      }
      setLoadeing(false);
    } catch (err) {
      console.error("Upload failed:", err);
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
  const updateProfilePictureInDB = async (imageUrl) => {
    try {
      if (!currentUser?._id) {
        throw new Error("لم يتم العثور على MongoDB ID لتحديثه.");
      }
      // لا حاجة لإرسال ID المستخدم، الخادم يحصل عليه من التوكن (JWT)
      const res = await fetch(`http://localhost:3000/api/user/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePicture: imageUrl,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // سيتم تمرير رسالة الخطأ إلى دالة upload الرئيسية
        throw new Error(data.message || "فشل تحديث قاعدة البيانات.");
      }

      // تحديث حالة Redux بالبيانات الجديدة (التي تحتوي على الصورة المحدثة)
      dispatch(updateSuccess(data));
      console.log("تم تحديث قاعدة البيانات و Redux بنجاح.");
    } catch (err) {
      // رمي الخطأ ليتم التقاطه في دالة upload الرئيسية
      throw new Error("فشل تحديث ملف التعريف: " + err.message);
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
        className={`w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full ${loding?"bg-linear-to-br from-purple-600 to-blue-500":""}`}
        onClick={() => {
          fillePikerRef.current.click();
        }}
      >
        {loding ? (
          <Spinner color="success" className="w-32 h-32 text-center" />
        ) : (
          <img
            src={url || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-6 border-gray-300"
          />
        )}
      </div>
    </>
  );
}
//#endregion
