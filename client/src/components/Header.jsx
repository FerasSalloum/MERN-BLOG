import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;
  return (
    <div>
      <Navbar className="border-b-2 border-b-transparent">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Feras's
          </span>
          Blog
        </Link>
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden sm:inline"
          />
        </form>
        <Button
          className="cursor-pointer w-12 h-10 sm:hidden p-0  bg-gray-700 dark:bg-gray-300 dark:text-gray-700"
          pill
        >
          <AiOutlineSearch className="text-xl" />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            className="cursor-pointer w-12 h-10 hidden sm:inline pl-[17px] bg-gray-700 dark:bg-gray-300 dark:text-gray-700"
            pill
          >
            <FaMoon />
          </Button>
          {currentUser ? (
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <Avatar
                  size="md"
                  img={currentUser.profilePicture}
                  rounded
                  className="cursor-pointer"
                />
              )}
            >
              <DropdownHeader>
                <span className="block text-sm">{currentUser.username}</span>
                <span className="block truncate text-sm font-medium">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              <DropdownDivider />
              <Link to={"/dashboard?tab=profile"}>
                <DropdownItem>Profile</DropdownItem>
              </Link>
              <DropdownItem>Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button className="cursor-pointer bg-linear-to-r from-purple-600 to-blue-500 text-white  focus:ring-blue-300 dark:focus:ring-blue-300 transition-colors ease-in-out duration-500">
                Sign In
              </Button>
            </Link>
          )}

          <NavbarToggle className="cursor-pointer" />
        </div>
        <NavbarCollapse>
          <NavbarLink
            active={path === "/"}
            className={`${
              path === "/"
                ? "bg-linear-to-r from-purple-600 to-blue-500 text-gray-200! rounded-xl transition-colors ease-in-out duration-500"
                : ""
            }`}
            as="div"
          >
            <Link className="w-full block px-2 py-0.5 " to={"/"}>
              Home
            </Link>
          </NavbarLink>
          <NavbarLink
            active={path === "/about"}
            className={`${
              path === "/about"
                ? "bg-linear-to-r from-purple-600 to-blue-500  text-gray-200! rounded-xl transition-colors ease-in-out duration-500"
                : ""
            }`}
            as="div"
          >
            <Link className="w-full block px-2 py-0.5" to={"/about"}>
              About
            </Link>
          </NavbarLink>
          <NavbarLink
            active={path === "/projects"}
            className={`${
              path === "/projects"
                ? "bg-linear-to-r from-purple-600 to-blue-500  text-gray-200! rounded-xl transition-colors ease-in-out duration-500"
                : ""
            }`}
            as="div"
          >
            <Link className="w-full block px-2 py-0.5" to={"/projects"}>
              Projects
            </Link>
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
};

export default Header;
