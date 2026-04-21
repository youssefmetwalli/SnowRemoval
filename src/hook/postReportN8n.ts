import type { ReportPostData } from "../types/reportForm";
import { saveToQueue } from "./useOfflineQueue";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string;

export type PostResult =
  | { status: "sent" }
  | { status: "queued"; savedAt: string };

export const postReportN8n = async (
  inputData: ReportPostData,
  options?: { skipQueue?: boolean }
): Promise<PostResult> => {
  if (!N8N_WEBHOOK_URL) {
    throw new Error(
      "n8n webhook URL が設定されていません。環境変数 VITE_N8N_WEBHOOK_URL を確認してください。"
    );
  }

  // If offline, go straight to queue
  if (!navigator.onLine) {
    if (options?.skipQueue) throw new Error("オフラインです");
    const record = saveToQueue(inputData);
    return { status: "queued", savedAt: record.savedAt };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "不明なエラー");
      throw new Error(`送信に失敗しました (${response.status}): ${errorText}`);
    }

    return { status: "sent" };
  } catch (error) {
    // Network error (not a server error) → save to queue
    if (error instanceof TypeError && !options?.skipQueue) {
      const record = saveToQueue(inputData);
      return { status: "queued", savedAt: record.savedAt };
    }
    throw error;
  }
};