import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient02";
import { WorkPlaceData } from "../types/workPlace";


export const getWorkPlace = ()=>{

    const [data, setData] = useState<WorkPlaceData[] | undefined>();
    const [isLoading, setLoading] = useState(true);
    const[isError, setError] = useState(false);


    useEffect(() => {
      (async () => {
        try {
          console.log("getworkplace送信");
          const data = await apiClient.get<WorkPlaceData[]>(
            `table_1754541394/records/?limit=100&apiName=secondary`
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