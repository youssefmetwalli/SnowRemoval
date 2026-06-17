import type { ReportN8nMetadata, ReportPostData } from "../types/reportForm";
import { saveToQueue } from "./useOfflineQueue";

export type PostResult =
  | {
      status: "sent";
      imageUrls?: string[];
      reportId?: string;
      response?: unknown;
    }
  | { status: "queued"; savedAt: string };

type UploadPhoto = {
  file: File;
};

type PostReportN8nOptions = ReportN8nMetadata & {
  photos?: UploadPhoto[];
  skipQueue?: boolean;
};

type N8nWebhookResponse = {
  ok?: boolean;
  imageUrls?: string[];
  reportId?: string;
  error?: string;
  message?: string;
  [key: string]: unknown;
};

const hasMetadata = (options?: PostReportN8nOptions) =>
  Boolean(
    options?.tachometerValue?.trim() ||
      (options?.tachometerMemos?.some((memo) => memo.trim()) ?? false)
  );

const hasPhotos = (options?: PostReportN8nOptions) =>
  Boolean(options?.photos?.length);

const buildFormData = (
  inputData: ReportPostData,
  options: PostReportN8nOptions
) => {
  const formData = new FormData();
  formData.append("report", JSON.stringify(inputData));

  if (options.tachometerValue !== undefined) {
    formData.append("tachometerValue", options.tachometerValue);
  }

  if (options.tachometerMemos !== undefined) {
    formData.append("tachometerMemos", JSON.stringify(options.tachometerMemos));
  }

  options.photos?.forEach((photo) => {
    formData.append("images", photo.file, photo.file.name);
  });

  return formData;
};

const parseN8nResponse = async (response: Response): Promise<N8nWebhookResponse | null> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as N8nWebhookResponse;
  } catch {
    return { message: text };
  }
};

export const postReportN8n = async (
  inputData: ReportPostData,
  options: PostReportN8nOptions = {}
): Promise<PostResult> => {
  const containsPhotos = hasPhotos(options);
  const containsMediaPayload = containsPhotos || hasMetadata(options);
  const metadata: ReportN8nMetadata = {
    tachometerValue: options.tachometerValue,
    tachometerMemos: options.tachometerMemos,
  };

  // If offline, go straight to queue
  if (!navigator.onLine) {
    if (options?.skipQueue) throw new Error("オフラインです");
    if (containsPhotos) {
      throw new Error(
        "画像付きの日報はオフラインでは送信できません。ネットワーク接続後に再度お試しください。"
      );
    }
    const record = saveToQueue(inputData, metadata);
    return { status: "queued", savedAt: record.savedAt };
  }

  try {
    const body = containsMediaPayload
      ? buildFormData(inputData, options)
      : JSON.stringify(inputData);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: containsMediaPayload
        ? undefined
        : { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "不明なエラー");
      throw new Error(`送信に失敗しました (${response.status}): ${errorText}`);
    }

    const n8nResponse = await parseN8nResponse(response);
    if (n8nResponse?.ok === false) {
      throw new Error(
        n8nResponse.error ?? n8nResponse.message ?? "n8nで送信処理に失敗しました。"
      );
    }

    return {
      status: "sent",
      imageUrls: n8nResponse?.imageUrls,
      reportId: n8nResponse?.reportId,
      response: n8nResponse,
    };
  } catch (error) {
    // Network error (not a server error) → save to queue
    if (error instanceof TypeError && !options?.skipQueue && !containsPhotos) {
      const record = saveToQueue(inputData, metadata);
      return { status: "queued", savedAt: record.savedAt };
    }
    throw error;
  }
};
