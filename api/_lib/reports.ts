import { randomUUID } from "node:crypto";
import type { SessionUser } from "./security";

const MAX_REPORT_BYTES = Number(process.env.REPORT_MAX_REQUEST_BYTES ?? 12_000_000);
const MAX_IMAGE_BYTES = Number(process.env.REPORT_MAX_IMAGE_BYTES ?? 5_000_000);
const MAX_IMAGES = Number(process.env.REPORT_MAX_IMAGES ?? 4);
const MAX_MEMOS = 20;
const MAX_MEMO_LENGTH = 500;
const MAX_TEXT_LENGTH = 300;

const imageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);

export type ValidatedImage = {
  blob: Blob;
  fileName: string;
};

export type ValidatedReportRequest = {
  report: Record<string, unknown>;
  tachometer_value?: string;
  tachometer_memos?: string[];
  images: ValidatedImage[];
};

const text = (
  value: unknown,
  label: string,
  options: { required?: boolean; nullable?: boolean; max?: number } = {}
) => {
  if ((value === null || value === undefined || value === "") && options.nullable) {
    return null;
  }
  if (typeof value !== "string") {
    if (!options.required && value === undefined) return "";
    throw new Error(`${label} must be text.`);
  }
  const trimmed = value.trim();
  if (options.required && !trimmed) throw new Error(`${label} is required.`);
  if (trimmed.length > (options.max ?? MAX_TEXT_LENGTH)) {
    throw new Error(`${label} is too long.`);
  }
  return trimmed;
};

const ref = (value: unknown, label: string, required = false) => {
  if (!Array.isArray(value)) {
    if (!required && (value === undefined || value === null)) return [];
    throw new Error(`${label} must be a reference array.`);
  }
  const clean = value.map((part) => String(part).slice(0, 120));
  if (required && !clean.some(Boolean)) throw new Error(`${label} is required.`);
  return clean;
};

const dateTime = (value: unknown, label: string, required = true) => {
  const clean = text(value, label, { required, max: 60 });
  if (clean && Number.isNaN(Date.parse(clean))) {
    throw new Error(`${label} must be a valid date or time.`);
  }
  return clean;
};

const allowedReportFields = new Set([
  "worker_id",
  "vehicle_id",
  "customer_id",
  "end_at",
  "work_type_id",
  "work_date",
  "work_place_id",
  "weather_id",
  "worker_name",
  "assistant_id",
  "assistant_name",
  "work_type_name",
  "vehicle_name",
  "work_place_name",
  "start_at",
  "company_name",
  "removal_amount",
]);

export const validateReport = (raw: unknown, session: SessionUser) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("report must be an object.");
  }
  const source = raw as Record<string, unknown>;
  const unexpected = Object.keys(source).filter((key) => !allowedReportFields.has(key));
  if (unexpected.length) throw new Error("report contains unsupported fields.");

  return {
    worker_id: session.workerRef,
    worker_name: session.name,
    vehicle_id: ref(source.vehicle_id, "vehicle", true),
    customer_id: ref(source.customer_id, "customer"),
    end_at: dateTime(source.end_at, "end time"),
    work_type_id: ref(source.work_type_id, "work type", true),
    work_date: dateTime(source.work_date, "work date"),
    work_place_id: ref(source.work_place_id, "work place"),
    weather_id: text(source.weather_id, "weather", { required: true }),
    assistant_id:
      source.assistant_id === null
        ? null
        : ref(source.assistant_id, "assistant"),
    assistant_name: text(source.assistant_name, "assistant name", {
      nullable: true,
    }),
    work_type_name: text(source.work_type_name, "work type name", {
      nullable: true,
    }),
    vehicle_name: text(source.vehicle_name, "vehicle name", { nullable: true }),
    work_place_name: text(source.work_place_name, "work place name", {
      nullable: true,
    }),
    start_at: dateTime(source.start_at, "start time"),
    company_name: text(source.company_name, "company name", {
      required: false,
    }),
    removal_amount: text(source.removal_amount, "removal amount", {
      nullable: true,
      max: 30,
    }),
  };
};

const hasBytes = (bytes: Uint8Array, expected: number[], offset = 0) =>
  expected.every((value, index) => bytes[offset + index] === value);

const imageSignatureMatches = (type: string, bytes: Uint8Array) => {
  if (type === "image/jpeg") return hasBytes(bytes, [0xff, 0xd8, 0xff]);
  if (type === "image/png") {
    return hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (type === "image/webp") {
    return hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) &&
      hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8);
  }
  if (type === "image/heic" || type === "image/heif") {
    const brand = new TextDecoder().decode(bytes.slice(4, 12));
    return brand.includes("ftyp") &&
      ["heic", "heix", "hevc", "hevx", "mif1", "msf1"].some((value) =>
        brand.includes(value)
      );
  }
  return false;
};

const validateImage = async (
  value: File,
  userId: string,
  index: number
) => {
  const extension = imageTypes.get(value.type);
  if (!extension) throw new Error("Only JPEG, PNG, WebP, HEIC, and HEIF images are allowed.");
  if (!value.size || value.size > MAX_IMAGE_BYTES) {
    throw new Error("An image exceeds the permitted upload size.");
  }

  const bytes = new Uint8Array(await value.arrayBuffer());
  if (!imageSignatureMatches(value.type, bytes)) {
    throw new Error("An uploaded image has an invalid file signature.");
  }

  return {
    blob: new Blob([bytes], { type: value.type }),
    fileName: `snow-report-${userId}-${Date.now()}-${index}-${randomUUID()}.${extension}`,
  };
};

const parseMemos = (value: unknown) => {
  if (value === null) return undefined;
  if (typeof value !== "string") throw new Error("tachometer_memos must be JSON.");
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || parsed.length > MAX_MEMOS) {
    throw new Error("tachometer_memos must be a small text list.");
  }
  return parsed.map((memo) =>
    text(memo, "tachometer memo", { required: false, max: MAX_MEMO_LENGTH }) as string
  );
};

const isUploadedFile = (value: unknown): value is File =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as File).name === "string" &&
      typeof (value as File).type === "string" &&
      typeof (value as File).size === "number" &&
      typeof (value as File).arrayBuffer === "function"
  );

export const parseReportRequest = async (
  request: Request,
  session: SessionUser
): Promise<ValidatedReportRequest> => {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length && length > MAX_REPORT_BYTES) throw new Error("Request is too large.");

  if (request.headers.get("content-type")?.includes("multipart/form-data")) {
    const form = await request.formData();
    const report = form.get("report");
    if (typeof report !== "string") throw new Error("report is required.");

    const rawImages = form
      .getAll("images")
      .filter((value): value is File => isUploadedFile(value));
    if (rawImages.length > MAX_IMAGES) throw new Error("Too many images.");

    return {
      report: validateReport(JSON.parse(report), session),
      tachometer_value:
        form.get("tachometer_value") === null
          ? undefined
          : (text(form.get("tachometer_value"), "tachometer value", {
              max: 40,
            }) as string),
      tachometer_memos: parseMemos(form.get("tachometer_memos")),
      images: await Promise.all(
        rawImages.map((image, index) => validateImage(image, session.id, index))
      ),
    };
  }

  return {
    report: validateReport(await request.json(), session),
    images: [],
  };
};
