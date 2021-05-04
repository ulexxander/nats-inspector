import React, { useEffect } from "react";
import { AppBar } from "./components/AppBar";
import { appInit } from "./domains/appInit/appInitUnits";
import { loadRoutes, RouterView } from "./lib/effector-router";
import { RequestsPage } from "./pages/RequestsPage";
import { SubscribtionsPage } from "./pages/SubscribtionsPage";

const NotFoundPage: React.FC = () => {
  return <div>not found??</div>;
};

export const App: React.FC = () => {
  useEffect(appInit, []);

  return (
    <div className="flex flex-col h-screen">
      <AppBar />
      <div className="flex-1 overflow-auto">
        <RouterView fallback={NotFoundPage} />
      </div>
    </div>
  );
};

loadRoutes([
  {
    path: "/requests",
    view: RequestsPage,
  },
  {
    path: "/subscribtions",
    view: SubscribtionsPage,
  },
]);
