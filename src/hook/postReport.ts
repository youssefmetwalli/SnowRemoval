import { apiClient } from "../lib/apiClient";


export const postReport = async (inputData: any) => {
  try {
    // console.log("post送信");
    const response = await apiClient.post<any>(
      "table_1754551086/records/",
      inputData
    );
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};