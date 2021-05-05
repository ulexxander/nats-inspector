import React from "react";
import { Link, LinkProps, useLocation } from "../lib/effector-router";
import { clazz } from "../lib/utils";

type NavbarLinkProps = LinkProps & {
  location: string;
};

const NavbarLink = (props: NavbarLinkProps) => {
  return (
    <Link
      className={clazz(
        "mx-4 text-2xl border-b-2 border-transparent cursor-pointer pb-1",
        props.location === props.to && "border-red-500"
      )}
      {...props}
    />
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav>
      <NavbarLink location={location} to="/requests">
        Requests
      </NavbarLink>
      <NavbarLink location={location} to="/subscribtions">
        Subs
      </NavbarLink>
      <NavbarLink location={location} to="/messages">
        Messages
      </NavbarLink>
    </nav>
  );
};

export const AppBar: React.FC = () => {
  return (
    <div className="flex items-center p-4 bg-blues-800">
      <div className="flex flex-1">
        <img className="h-10" src="/nats-icon-white.png" alt="NATS" />

        <h2 className="ml-6 text-3xl tracking-wide">NATS Inspector</h2>
      </div>

      <Navbar />
    </div>
  );
};
