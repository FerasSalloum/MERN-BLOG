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

const Signup = () => {
  const customTheme = createTheme({
    spinner: {
      color: {
        custom: "fill-fuchsia-800",
      },
    },
  });

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handelSumit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("http://localhost:3000/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        Navigate("/sign-in");
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error);
      setLoading(false);
    }
  };
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
            this is a demo project. you can sing up with your email and password
            or with google
          </p>
        </div>
        {/* rigth */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handelSumit}>
            <div>
              <Label>your username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="name"
                required
                onChange={handleChange}
              />
            </div>
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
            <OAuth/>
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
