import React from "react";

export const Page: React.FC = ({ children }) => {
  return <div className="h-screen p-4 text-white bg-gray-800">{children}</div>;
};
