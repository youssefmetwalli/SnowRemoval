import { apiClient } from "../lib/apiClient";


export const putReport = async (inputData: any, id: string) => {
  try {
    // console.log("put送信");
    const response = await apiClient.put<any>(
      "reports",
      inputData,
      "field_dayReportId",
      id
    );
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
