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
  tachometerValue?: string;
  tachometerMemos?: string[];
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
  "field_workerId",
  "field_carId",
  "field_CustomerId",
  "field_endTime",
  "field_workClassId",
  "field_workDate",
  "field_workPlaceId",
  "field_weather",
  "field_workerName",
  "field_assistantId",
  "field_assistantName",
  "field_workClassName",
  "field_carName",
  "field_workPlaceName",
  "field_startTime",
  "field_CompanyName",
  "field_removalVolume",
]);

export const validateReport = (raw: unknown, session: SessionUser) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("report must be an object.");
  }
  const source = raw as Record<string, unknown>;
  const unexpected = Object.keys(source).filter((key) => !allowedReportFields.has(key));
  if (unexpected.length) throw new Error("report contains unsupported fields.");

  return {
    field_workerId: session.workerRef,
    field_workerName: session.name,
    field_carId: ref(source.field_carId, "car", true),
    field_CustomerId: ref(source.field_CustomerId, "customer"),
    field_endTime: dateTime(source.field_endTime, "end time"),
    field_workClassId: ref(source.field_workClassId, "work class", true),
    field_workDate: dateTime(source.field_workDate, "work date"),
    field_workPlaceId: ref(source.field_workPlaceId, "work place"),
    field_weather: text(source.field_weather, "weather", { required: true }),
    field_assistantId:
      source.field_assistantId === null
        ? null
        : ref(source.field_assistantId, "assistant"),
    field_assistantName: text(source.field_assistantName, "assistant name", {
      nullable: true,
    }),
    field_workClassName: text(source.field_workClassName, "work class name", {
      nullable: true,
    }),
    field_carName: text(source.field_carName, "car name", { nullable: true }),
    field_workPlaceName: text(source.field_workPlaceName, "work place name", {
      nullable: true,
    }),
    field_startTime: dateTime(source.field_startTime, "start time"),
    field_CompanyName: text(source.field_CompanyName, "company name", {
      required: false,
    }),
    field_removalVolume: text(source.field_removalVolume, "removal volume", {
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
  if (typeof value !== "string") throw new Error("tachometerMemos must be JSON.");
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || parsed.length > MAX_MEMOS) {
    throw new Error("tachometerMemos must be a small text list.");
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
      tachometerValue:
        form.get("tachometerValue") === null
          ? undefined
          : (text(form.get("tachometerValue"), "tachometer value", {
              max: 40,
            }) as string),
      tachometerMemos: parseMemos(form.get("tachometerMemos")),
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
