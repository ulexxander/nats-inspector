import { useStore } from "effector-react";
import React from "react";
import { activeConnsQuery } from "../domains/connections/connectionsRequests";
import {
  $currentConnectionId,
  setCurrentConnectionId,
} from "../domains/connections/connectionsUnits";
import { cn } from "../lib/classes";
import { Link, LinkProps, useLocation } from "../lib/effector-router";

type NavbarLinkProps = LinkProps & {
  location: string;
};

const NavbarLink = (props: NavbarLinkProps) => {
  return (
    <Link
      className={cn(
        "mx-4 text-2xl border-b-2 border-transparent cursor-pointer pb-1",
        props.location === props.to && "border-red-500",
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
      <NavbarLink location={location} to="/subscriptions">
        Subs
      </NavbarLink>
      <NavbarLink location={location} to="/messages">
        Messages
      </NavbarLink>
      <NavbarLink location={location} to="/connections">
        Connections
      </NavbarLink>
    </nav>
  );
};

const CurrentConnection: React.FC = () => {
  const currentConnId = useStore($currentConnectionId);
  const activeConns = useStore(activeConnsQuery.data) || [];

  const options = activeConns.map((conn) => (
    <option key={conn.model.id} value={conn.model.id}>
      {conn.model.title}
    </option>
  ));

  return (
    <div className="ml-4">
      <select
        className="w-48 px-4 py-2 font-bold border-gray-700 rounded bg-blues-900 form-select"
        name="current-connection"
        value={currentConnId}
        onChange={(e) => {
          setCurrentConnectionId(Number(e.target.value));
        }}
      >
        <option value={-1} disabled>
          Select connection
        </option>
        {options}
      </select>
    </div>
  );
};

export const AppBar: React.FC = () => {
  return (
    <div className="flex items-center p-4 bg-blues-800">
      <div className="flex flex-1">
        <img className="h-10" src="/nats-icon-white.png" alt="NATS" />

        <h2 className="ml-6">NATS Inspector</h2>
      </div>

      <Navbar />

      <CurrentConnection />
    </div>
  );
};
