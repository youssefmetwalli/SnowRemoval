import type { ReportPostData } from "../types/reportForm";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string;

export const postReportN8n = async (inputData: ReportPostData): Promise<void> => {
  if (!N8N_WEBHOOK_URL) {
    throw new Error("n8n webhook URL が設定されていません。環境変数 VITE_N8N_WEBHOOK_URL を確認してください。");
  }

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "不明なエラー");
    throw new Error(`送信に失敗しました (${response.status}): ${errorText}`);
  }
};