import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { InputConfirmation } from "./screens/InputConfirmation/InputConfirmation";
import { LoginScreen } from "./screens/LoginScreen";
import { ReportInputScreen } from "./screens/ReportInputScreen/ReportInputScreen";
import { ReportListScreen } from "./screens/ReportListScreen/ReportListScreen";
import SimpleReportPage from "./screens/SimpleReportPage";
import { ReportEditScreen } from "./screens/ReportEditScreen/ReportEditScreen";

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
    element: <InputConfirmation open={false} onOpenChange={function (open: boolean): void {
      throw new Error("Function not implemented.");
    } } data={{
      workDate: undefined,
      workplace: undefined,
      workClassification: undefined,
      startTime: undefined,
      endTime: undefined,
      mainPerson: undefined
    }} />,
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
    path: "/reporteditscreen",
    element: <ReportEditScreen />,
  },
  {
    path: "/testapi",
    element: <SimpleReportPage />
  }
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
