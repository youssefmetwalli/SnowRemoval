const DEFAULT_MAX_DIM = 1600;
const DEFAULT_QUALITY = 0.85;

/**
 * canvas でリサイズし JPEG に変換する。長辺を maxDim 以下に収める。
 * 元画像が maxDim 以下ならリサイズせず元 File を返す。
 * リサイズや変換に失敗した場合も元 File を返す (送信は継続)。
 */
export const resizeImage = async (
  file: File,
  maxDim: number = DEFAULT_MAX_DIM,
  quality: number = DEFAULT_QUALITY
): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;
  if (typeof document === "undefined" || typeof URL === "undefined") return file;

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return file;

    const longest = Math.max(w, h);
    if (longest <= maxDim) return file;

    const scale = maxDim / longest;
    const targetW = Math.round(w * scale);
    const targetH = Math.round(h * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
    });
    if (!blob) return file;

    const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${nameWithoutExt}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("画像読み込みに失敗しました"));
    img.src = src;
  });
