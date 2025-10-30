import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { WorkerData } from "../types/worker";


export const getWorker = ()=>{

    const [data, setData] = useState<WorkerData[] | undefined>();
    const [isLoading, setLoading] = useState(true);
    const[isError, setError] = useState(false);


    useEffect(() => {
      (async () => {
        try {
          // console.log("get送信");
          const data = await apiClient.get<WorkerData[]>(
            `table_1754549652/records/?limit=100`
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