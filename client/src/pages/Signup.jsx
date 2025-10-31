import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5">
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
          <form className="flex flex-col gap-4">
            <div>
              <Label>your username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="name"
                required
              />
            </div>
            <div>
              <Label>your email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@email.com"
                required
              />
            </div>
            <div>
              <Label>your password</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="*********"
                required
              />
            </div>
            <Button className="SingnB" type="submit">
              Singn Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Singn in{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
