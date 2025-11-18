import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import TestDashProfileUpload from "./Test";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);;
 
  //////////////////////////////////////////////
  // const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  // const [imageFileUploadError, setImageFileUploadError] = useState(null);
  //////////////////////////////////////////////
  
  return (
    <div className="mx-auto max-w-lg p-3 min-h-screen">
      <h1 className="my-7 text-center font-semibold text-3xl text-black dark:text-white">
        Pofile
      </h1>
      <form className="flex flex-col w-full  gap-4 ">
            <TestDashProfileUpload/>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="*******" />
        <Button
          color="purple"
          outline
          className="cursor-pointer hover:bg-linear-to-br hover:from-purple-600 hover:to-blue-600 text-black dark:text-[#AC94FA]"
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
