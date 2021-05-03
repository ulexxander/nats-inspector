import React from "react";
import { AppBar } from "../AppBar";

export const Page: React.FC = ({ children }) => {
  return (
    <div className="h-screen text-white bg-gray-800">
      <AppBar />
      <div className="p-4">{children}</div>
    </div>
  );
};
