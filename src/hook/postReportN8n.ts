import type { ReportN8nMetadata, ReportPostData } from "../types/reportForm";
import { saveToQueue } from "./useOfflineQueue";
import { resizeImage } from "../lib/resizeImage";

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

const weatherMap: Record<string, number> = {
  "晴れ": 1,
  "曇り": 2,
  "雨": 3,
  "雪": 4,
  "吹雪": 5,
  "みぞれ": 6,
};

const pickId = (arr?: unknown): number | null => {
  if (!arr) return null;
  if (!Array.isArray(arr)) {
    const val = Number(arr);
    return isNaN(val) ? null : val;
  }
  const idStr = arr[1] ?? arr[0];
  const val = Number(idStr);
  return isNaN(val) ? null : val;
};

const nullIfEmpty = (s: string | null | undefined) =>
  s && s.trim() !== "" ? s : null;

const toIsoDate = (dateStr: string) => {
  if (!dateStr) return "";
  const tzOffset = "+09:00";
  return `${dateStr}T00:00${tzOffset}`;
};

const toIsoDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return "";
  const tzOffset = "+09:00";
  return `${dateStr}T${timeStr}${tzOffset}`;
};

// ReportPostData を snake_case のペイロードにトランスフォーム
export const transformToSnakeCase = (v: ReportPostData, options: PostReportN8nOptions = {}) => {
  const weatherStr = v.field_weather || "";
  const weatherId = weatherMap[weatherStr] ?? 1; // マップできない場合はデフォルト1

  return {
    worker_id: pickId(v.field_workerId),
    car_id: pickId(v.field_carId),
    customer_id: pickId(v.field_CustomerId),
    work_class_id: pickId(v.field_workClassId),
    work_date: toIsoDate(v.field_workDate),
    work_place_id: pickId(v.field_workPlaceId),
    weather_id: weatherId,
    worker_name: nullIfEmpty(v.field_workerName),
    assistant_id: v.field_assistantId && v.field_assistantId.length ? pickId(v.field_assistantId) : null,
    assistant_name: nullIfEmpty(v.field_assistantName),
    work_class_name: nullIfEmpty(v.field_workClassName),
    car_name: nullIfEmpty(v.field_carName),
    work_place_name: nullIfEmpty(v.field_workPlaceName),
    start_time: toIsoDateTime(v.field_workDate, v.field_startTime),
    end_time: toIsoDateTime(v.field_workDate, v.field_endTime),
    company_name: nullIfEmpty(v.field_CompanyName),
    removal_volume: v.field_removalVolume && Number(v.field_removalVolume) > 0 ? String(v.field_removalVolume) : null,
    // 追加スキーマの暫定適合 (PrismaのTachometerNotes等に対応)
    tachometer_value: options.tachometerValue || null,
    tachometer_notes: options.tachometerMemos || [],
  };
};

const hasMetadata = (options?: PostReportN8nOptions) =>
  Boolean(
    options?.tachometerValue?.trim() ||
      (options?.tachometerMemos?.some((memo) => memo.trim()) ?? false)
  );

const hasPhotos = (options?: PostReportN8nOptions) =>
  Boolean(options?.photos?.length);

const buildFormData = async (
  inputData: ReportPostData,
  options: PostReportN8nOptions
) => {
  const formData = new FormData();
  const transformed = transformToSnakeCase(inputData, options);

  formData.append("report", JSON.stringify(transformed));

  if (options.tachometerValue !== undefined) {
    formData.append("tachometer_value", options.tachometerValue);
  }

  if (options.tachometerMemos !== undefined) {
    formData.append("tachometer_notes", JSON.stringify(options.tachometerMemos));
  }

  const photos = options.photos ?? [];
  const resized = await Promise.all(
    photos.map(async (photo) => ({
      file: await resizeImage(photo.file),
    }))
  );
  resized.forEach((photo) => {
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
    let body: BodyInit;
    let headers: HeadersInit | undefined = undefined;

    if (containsMediaPayload) {
      body = await buildFormData(inputData, options);
    } else {
      const transformed = transformToSnakeCase(inputData, options);
      body = JSON.stringify(transformed);
      headers = { "Content-Type": "application/json" };
    }

    let response: Response | null = null;
    let lastServerError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      response = await fetch("/n8n/webhook/report-submit", {
        method: "POST",
        credentials: "include",
        headers,
        body,
      });

      if (response.ok) break;

      // 4xx はリトライしない (バリデーションエラー等)
      if (response.status < 500) {
        const errorText = await response.text().catch(() => "不明なエラー");
        throw new Error(`送信に失敗しました (${response.status}): ${errorText}`);
      }

      const errorText = await response.text().catch(() => "サーバーエラー");
      lastServerError = new Error(
        `送信に失敗しました (${response.status}): ${errorText}`
      );

      if (attempt < MAX_RETRIES) {
        await sleep(BASE_BACKOFF_MS * Math.pow(2, attempt - 1));
      }
    }

    if (!response || !response.ok) {
      throw lastServerError ?? new Error("n8n webhook 送信に失敗しました");
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
