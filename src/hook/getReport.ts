import { useEffect, useState } from "react";
import { ReportFormData } from "../types/reportForm";
import { apiClient } from "../lib/apiClient";


export const getReport = ()=>{
    const [data, setData] = useState<ReportFormData[] | undefined>();
    const [isLoading, setLoading] = useState(true);
    const[isError, setError] = useState(false);

    useEffect(() => {
      (async () => {
        try {
          console.log("get送信");
          const data = await apiClient.get<ReportFormData[]>(
            "table_1754551086/records/"
          );
          setData(data);
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoading(false);
        }
      })(); // ← ここで実行
    }, []);


    return{ data, isLoading, isError};
}