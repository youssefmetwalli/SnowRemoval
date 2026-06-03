import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { InputConfirmation } from "./screens/InputConfirmation/InputConfirmation";
import { LoginScreen } from "./screens/LoginScreen";
import { ReportInputScreen } from "./screens/ReportInputScreen/ReportInputScreen";
import { ReportListScreen } from "./screens/ReportListScreen/ReportListScreen";
import { ReportEditScreen } from "./screens/ReportEditScreen/ReportEditScreen";
import { RequireAuth } from "./components/RequireAuth";

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
    element: <InputConfirmation open={false} onOpenChange={function (_open: boolean): void {
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
    element: <RequireAuth><HomeScreen /></RequireAuth>,
  },
  {
    path: "/reportlistscreen",
    element: <RequireAuth><ReportListScreen /></RequireAuth>,
  },
  {
    path: "/reportinputscreen",
    element: <RequireAuth><ReportInputScreen /></RequireAuth>,
  },
  {
    path: "/reporteditscreen",
    element: <RequireAuth><ReportEditScreen /></RequireAuth>,
  }
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
