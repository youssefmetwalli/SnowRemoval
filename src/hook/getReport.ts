import { useEffect, useState } from "react";
import { ReportGetData } from "../types/reportForm";
import { apiClient } from "../lib/apiClient";

export const useReport = () => {
  const [data, setData] = useState<ReportGetData[]>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const loginUser = localStorage.getItem("loggedInUser");
  const parsedLoginUser = JSON.parse(loginUser!);
  const loginUserId = parsedLoginUser.field_1754635302[1];

  useEffect(() => {
    (async () => {
      try {
        console.log("get送信");
        const res = await apiClient.get<ReportGetData[]>(
          `table_1754551086/records/?limit=100&_field_workerId=${loginUserId}&filter_1761218755&field_workDate=-7`
        );
        setData(res);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, isLoading, isError };
};
