import { apiClient } from "../lib/apiClient";


export const putReport = async (inputData: any, id: string) => {
  try {
    console.log("put送信");
    const response = await apiClient.put<any>(
      "table_1754551086/records/",
      inputData,
      id
    );
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};