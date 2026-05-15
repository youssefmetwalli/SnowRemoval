import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { RouteGetData } from "../types/reportForm";


export const useRoute = (userName: string|undefined)=>{
    const [data, setData] = useState<RouteGetData[] | undefined>();
    const [isLoading, setLoading] = useState(true);
    const[isError, setError] = useState(false);
    const query = userName
      ? `_field_workerName=${userName}`
      : "";

    useEffect(() => {
      (async () => {
        try {
          // console.log("get送信。ユーザー名:", userName);
          const data = await apiClient.get<RouteGetData[]>(
            `table_1756952069/records/?limit=100&${query}`
          );
          setData(data);
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoading(false);
        }
      })();
    }, []);


    return{ data, isLoading, isError};
}