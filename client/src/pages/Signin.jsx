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

const Signin = () => {
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handelSumit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      // return setError("please fill out all fields.");
      return dispatch(signInFaluer("please fill out all fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:3000/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        return dispatch(signInFaluer(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        Navigate("/");
      }
    } catch (error) {
      dispatch(signInFaluer(error));
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
          <Link to="/" className="font-bold text-black text-4xl">
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
          <form className="flex flex-col gap-4" onSubmit={handelSumit}>
            {/* <div>
              <Label>your username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="name"
                required
                onChange={handleChange}
              />
            </div> */}
            <div>
              <Label>your email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@email.com"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>your password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="*********"
                required
                onChange={handleChange}
              />
            </div>
            <Button
              className="SingnB cursor-pointer"
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
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Singn up{" "}
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
