import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { InputConfirmation } from "./screens/InputConfirmation/InputConfirmation";
import { LoginScreen } from "./screens/LoginScreen";
import { ReportInputScreen } from "./screens/ReportInputScreen/ReportInputScreen";
import { ReportListScreen } from "./screens/ReportListScreen/ReportListScreen";
import SimpleReportPage from "./screens/SimpleReportPage";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <LoginScreen />,
  },
  {
    path: "/loginscreen",
    element: <LoginScreen />,
  },
  {
    path: "/inputconfirmationpopup",
    element: <InputConfirmation />,
  },
  {
    path: "/homescreen",
    element: <HomeScreen />,
  },
  {
    path: "/reportlistscreen",
    element: <ReportListScreen />,
  },
  {
    path: "/reportinputscreen",
    element: <ReportInputScreen />,
  },
  {
    path: "/testapi",
    element: <SimpleReportPage />
  }
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
