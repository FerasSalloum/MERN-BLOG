import React from "react";
import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
import { Link } from "react-router-dom";
const FooterCom = () => {
  return (
    <Footer container className="border border-t-8! border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center ">
          <div className="">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Feras's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5 sm:mt-auto sm:grid-cols-3 sm:gap-6 md:mt-auto">
            <div>
              <FooterTitle title="About" />
              <FooterLinkGroup col>
                <FooterLink href="/" target="_blank" rel="noopener norefrrer">
                  100 JS project
                </FooterLink>
                <FooterLink href="/" target="_blank" rel="noopener norefrrer">
                  Feras's Blog
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" />
              <FooterLinkGroup col>
                <FooterLink href="/" target="_blank" rel="noopener norefrrer">
                  GitHup
                </FooterLink>
                <FooterLink href="/" target="_blank" rel="noopener norefrrer">
                  Discord
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div className="mt-5 sm:mt-auto">
              <FooterTitle title="legal" />
              <FooterLinkGroup col>
                <FooterLink href="/" target="_blank" rel="noopener norefrrer">
                  privacy Policy
                </FooterLink>
                <FooterLink href="/" target="_blank" rel="noopener norefrrer">
                  Terms &amp; Conditions
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            href="#"
            by="Sahand's blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-5 sm:mt-0 sm:justify-center">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
