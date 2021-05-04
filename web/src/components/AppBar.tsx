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
    </nav>
  );
};

export const AppBar: React.FC = () => {
  return (
    <div className="flex justify-between p-4 bg-blag-500">
      <h2 className="text-3xl font-bold tracking-wider text-nats-n">
        NATS Inspector
      </h2>

      <Navbar />
    </div>
  );
};
