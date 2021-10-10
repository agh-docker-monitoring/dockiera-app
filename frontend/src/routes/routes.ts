import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AddHost from "../components/AddHost/AddHost";
import Dashboard from "../components/Dashboard/Dashboard";
import HostBoard from "../components/HostBoard/HostBoard";

interface Route {
  path: string;
  exact: boolean;
  component: React.FC | React.FC<RouteComponentProps<any>>;
}

export const protectedRoutes: Route[] = [
  {
    path: "/protected",
    exact: true,
    component: Dashboard,
  },
];

export const openRoutes: Route[] = [
  {
    path: "/",
    exact: true,
    component: Dashboard,
  },
  {
    path: "/addHost",
    exact: true,
    component: AddHost,
  },
  {
    path: "/host/:id(\\d+)",
    exact: true,
    component: HostBoard,
  },
];
