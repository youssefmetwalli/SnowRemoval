import { apiClient } from "../lib/apiClient";
import { transformToSnakeCase } from "./postReportN8n";

export const postReport = async (inputData: any) => {
  try {
    const transformed = transformToSnakeCase(inputData);
    const response = await apiClient.post<any>("reports", transformed);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};