import React, { useEffect } from "react";
import { AppBar } from "./components/AppBar";
import { Page } from "./components/elements/layout";
import { appInit } from "./domains/appInit/appInitUnits";
import { loadRoutes, RouterView } from "./lib/effector-router";
import { ConnectionsPage } from "./pages/connections/ConnectionsPage";
import { MessagesPage } from "./pages/MessagesPage";
import { RequestsPage } from "./pages/RequestsPage";
import { SubscriptionsPage } from "./pages/subscriptions/SubscriptionsPage";

const NotFoundPage: React.FC = () => {
  return <Page>Stuff not found, click on those links in the appbar</Page>;
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
    path: "/subscriptions",
    view: SubscriptionsPage,
  },
  {
    path: "/messages",
    view: MessagesPage,
  },
  {
    path: "/connections",
    view: ConnectionsPage,
  },
]);
