import { apiClient } from "../lib/apiClient";
import { transformToSnakeCase } from "./postReportN8n";

export const putReport = async (inputData: any, id: string) => {
  try {
    const transformed = transformToSnakeCase(inputData);
    const response = await apiClient.put<any>(`reports/${id}`, transformed);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};