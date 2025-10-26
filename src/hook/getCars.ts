import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { CarData } from "../types/car";


export const getCar = ()=>{

    const [data, setData] = useState<CarData[] | undefined>();
    const [isLoading, setLoading] = useState(true);
    const[isError, setError] = useState(false);


    useEffect(() => {
      (async () => {
        try {
          console.log("get送信");
          const data = await apiClient.get<CarData[]>(
            `table_2000620006/records/?limit=100`
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