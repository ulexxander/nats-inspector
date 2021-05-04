import { createEffect, createEvent, createStore, forward } from "effector";
import { useStore } from "effector-react";
import React from "react";

export type Route = {
  view: React.FC;
  path: string;
};

type RoutesMap = Map<string, Route>;

export const $location = createStore<string>("/");
export const $availableRoutes = createStore<RoutesMap>(new Map());

export const pushRoute = createEvent<string>();
export const loadRoutes = createEvent<Route[]>();
export const updateLocation = createEvent<string>();

const pushRouteFx = createEffect<string, void>((path) => {
  history.pushState({ path }, "", path);
});

forward({
  from: pushRoute,
  to: [pushRouteFx, updateLocation],
});

$location.on(updateLocation, (_, path) => path);
$availableRoutes.on(
  loadRoutes,
  (_, routes) => new Map(routes.map((route) => [route.path, route]))
);

window.addEventListener("popstate", (e) => {
  if (e.state) {
    updateLocation(e.state.path);
  }
});

pushRoute(window.location.pathname);

// React bindings
export type RouterViewProps = {
  fallback: React.FC;
};

export const RouterView = (props: RouterViewProps) => {
  const routes = useStore($availableRoutes);
  const location = useStore($location);

  const currentRoute = routes.get(location);

  return currentRoute
    ? React.createElement(currentRoute.view, null)
    : React.createElement(props.fallback, null);
};

export type LinkProps = {
  to: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export const Link = (props: LinkProps) => {
  return React.createElement("a", {
    className: props.className,
    onClick: () => pushRoute(props.to),
    children: props.children,
  });
};

export const useLocation = () => {
  return useStore($location);
};
