import { ReportFormData } from "../types/reportForm";
import { apiClient } from "../lib/apiClient";


export const postReport = async (inputData: ReportFormData) => {
  try {
    console.log("post送信");
    const response = await apiClient.post<any>(
      "table_1754551086/records/",
      JSON.stringify(inputData)
    );
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};