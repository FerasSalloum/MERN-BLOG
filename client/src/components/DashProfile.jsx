import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSuccess } from "../app/user/userSlice";
import DashProfileUpload from "./DashProfileUpload";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [user,setuser] =useState({
    username: currentUser.username,
    email: currentUser.email,
    password:"",
  });
  const handelChange = (e) => {     
    setuser({...user ,[e.target.id] : e.target.value});    
  };
  const UpdateUser = async () => {
    console.log(user);
    
    try {
      if (!currentUser?._id) {
        throw new Error("لم يتم العثور على MongoDB ID لتحديثه.");
      }
      // لا حاجة لإرسال ID المستخدم، الخادم يحصل عليه من التوكن (JWT)
      const res = await fetch(`http://localhost:3000/api/user/update-info`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentUser._id,
          username: user.username,
          email: user.email,
          password: user.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // سيتم تمرير رسالة الخطأ إلى دالة upload الرئيسية
        throw new Error(data.message || "فشل تحديث قاعدة البيانات.");
      }

      // تحديث حالة Redux بالبيانات الجديدة (التي تحتوي على الصورة المحدثة)
      dispatch(updateSuccess(data));
      console.log("تم تحديث قاعدة البيانات بنجاح.");
    } catch (err) {
      // رمي الخطأ ليتم التقاطه في دالة upload الرئيسية
      throw new Error("فشل تحديث ملف التعريف: " + err.message);
    }
  };
  return (
    <div className="mx-auto max-w-lg p-3 min-h-screen">
      <h1 className="my-7 text-center font-semibold text-3xl text-black dark:text-white">
        Pofile
      </h1>
      <form className="flex flex-col w-full  gap-4 ">
        <DashProfileUpload />
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={(e) => {
            handelChange(e);
          }}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={(e) => {
            handelChange(e);
          }}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="*******"
          onChange={(e) => {
            handelChange(e);
          }}
        />
        <Button
          color="purple"
          outline
          className="cursor-pointer hover:bg-linear-to-br hover:from-purple-600 hover:to-blue-600 text-black dark:text-[#AC94FA]"
          onClick={() => {
            UpdateUser();
          }}
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delet Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
