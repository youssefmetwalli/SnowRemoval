import { useMemo } from "react";
import { ReportLike, ReportListFilters } from "../types/listFilters";


export function filterReports<T extends ReportLike>(
  reports: T[] = [],
  filters: ReportListFilters
): T[] {
  const q   = (filters.query ?? "").trim().toLowerCase();
  const cls = (filters.classification ?? "").trim().toLowerCase();
  const loc = (filters.location ?? "").trim().toLowerCase();
  const datePrefix = filters.date ?? ""; // "YYYY-MM-DD"

  const arr = reports.filter((r) => {
    const workDate = r.field_workDate ?? "";
    const place  = (r.field_workPlaceName ?? "").toLowerCase();
    const klass  = (r.field_workClassName ?? "").toLowerCase();
    const worker = (r.field_workerName ?? "").toLowerCase();

    const hay = `${place} ${klass} ${worker}`;
    const matchesQuery = !q || hay.includes(q);
    const matchesClass = !cls || klass.includes(cls);
    const matchesLoc   = !loc || place.includes(loc);
    const matchesDate  = !datePrefix || workDate.startsWith(datePrefix);

    return matchesQuery && matchesClass && matchesLoc && matchesDate;
  });

  arr.sort((a, b) => {
    const da = new Date(a.field_workDate ?? 0).getTime();
    const db = new Date(b.field_workDate ?? 0).getTime();
    if (db !== da) return db - da;

    const sa = new Date(a.field_startTime ?? 0).getTime();
    const sb = new Date(b.field_startTime ?? 0).getTime();
    return sb - sa;
  });

  return arr;
}

export function groupReports<T extends ReportLike>(filtered: T[]): Array<[string, T[]]> {
  const m = new Map<string, T[]>();
  for (const r of filtered) {
    const key = (r.field_workDate ?? "").slice(0, 10); // YYYY-MM-DD
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(r);
  }
  return Array.from(m.entries()).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}

export function useReportList<T extends ReportLike>(
  reports: T[] | undefined,
  filters: ReportListFilters
) {
  const filtered = useMemo(() => filterReports(reports ?? [], filters), [reports, filters]);
  const grouped  = useMemo(() => groupReports(filtered), [filtered]);
  return { filtered, grouped };
}
