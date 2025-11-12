import type { JSX } from "react";
import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Setting from "../pages/Setting";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/settings",
    element: <Setting />,
  },
];

function AppRoutes(): JSX.Element | null {
  return useRoutes(routes);
}

export default AppRoutes;
