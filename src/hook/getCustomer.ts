import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { CustomerData } from "../types/customer";


export const getCustomer = ()=>{

    const [data, setData] = useState<CustomerData[] | undefined>();
    const [isLoading, setLoading] = useState(true);
    const[isError, setError] = useState(false);


    useEffect(() => {
      (async () => {
        try {
          // console.log("get送信");
          const data = await apiClient.get<CustomerData[]>(
            `table_1754541395/records/?limit=100`
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