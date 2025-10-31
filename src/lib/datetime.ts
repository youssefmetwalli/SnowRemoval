export const formatDateJP = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : "";

export const formatTimeJP = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("ja-JP", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })
    : "";

export const fmtDate = (val?: string) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const fmtTimeRange = (start?: string, end?: string) => {
  const s = start && start.length ? start : "—";
  const e = end && end.length ? end : "—";
  return `${s} ～ ${e}`;
};