// ReportListSection.tsx
import { ClockIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { useReport } from "../../../../hook/getReport";
import React, { useMemo } from "react";
import type { ReportListFilters } from "../../ReportListScreen";
import { getCurrentUser } from "../../../../hook/getCurrentUser";

type Props = {
  filters: ReportListFilters;
};

export const ReportListSection: React.FC<Props> = ({ filters }) => {
  const navigate = useNavigate();
  const { name: user} = getCurrentUser();
  const { data: reports } = useReport(user); // your hook

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("ja-JP", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });

  // Filter + sort (desc by date)
  const filtered = useMemo(() => {
    if (!reports) return [];

    const q = filters.query.trim().toLowerCase();
    const cls = filters.classification.trim().toLowerCase();
    const loc = filters.location.trim().toLowerCase();
    const datePrefix = filters.date; // "YYYY-MM-DD" — your field_workDate starts with date

    const arr = reports.filter((r) => {
      const workDate = r.field_workDate || "";
      const place = (r.field_workPlaceName || "").toLowerCase();
      const klass = (r.field_workClassName || "").toLowerCase();
      const worker = (r.field_workerName || "").toLowerCase();

      // free text matches any of these
      const hay = `${place} ${klass} ${worker}`.toLowerCase();
      const matchesQuery = !q || hay.includes(q);

      const matchesClass = !cls || klass.includes(cls);
      const matchesLoc = !loc || place.includes(loc);
      const matchesDate = !datePrefix || workDate.startsWith(datePrefix);

      return matchesQuery && matchesClass && matchesLoc && matchesDate;
    });

    // sort most recent first by field_workDate, then by start time if you like
    arr.sort((a, b) => {
      const da = new Date(a.field_workDate).getTime();
      const db = new Date(b.field_workDate).getTime();
      if (db !== da) return db - da;

      // optional tie-breaker: start time
      const sa = new Date(a.field_startTime || 0).getTime();
      const sb = new Date(b.field_startTime || 0).getTime();
      return sb - sa;
    });

    return arr;
  }, [reports, filters]);

  // Group by date for headings
  const grouped = useMemo(() => {
    const m = new Map<string, typeof filtered>();
    for (const r of filtered) {
      const key = (r.field_workDate || "").slice(0, 10); // YYYY-MM-DD
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(r);
    }
    // return as array of [date, items] sorted desc
    return Array.from(m.entries()).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [filtered]);

  return (
    <div className="w-full h-[861px] overflow-scroll">
      <div className="flex flex-col w-[calc(100%_-_40px)] mx-5 my-4 gap-3">
        {grouped.map(([dateKey, list], idx) => (
          <div key={dateKey + idx} className="flex flex-col gap-3">
            <header className="flex flex-col items-start pt-0 pb-0.5 px-0 w-full">
              <h2 className="w-full font-semibold text-slate-600 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
                {formatDate(dateKey)}
              </h2>
            </header>

            {list.map((report, reportIndex) => (
              <Card
                key={reportIndex}
                className="w-full bg-white rounded-xl border border-solid border-slate-200 shadow-[0px_1px_3px_#0000001a] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] cursor-pointer hover:shadow-[0px_4px_8px_#0000001a] hover:scale-[1.01] transition-all duration-200"
                onClick={() => navigate("/reporteditscreen", { state: report })}
              >
                <CardContent className="flex flex-col items-start gap-3 p-[17px] relative">
                  <div className="gap-1 w-full flex flex-col items-start">
                    <div className="flex flex-col items-start pt-0 pb-0.5 px-0 w-full">
                      <h3 className="w-full font-semibold text-ebony text-base">
                        {report.field_workPlaceName}
                      </h3>
                    </div>

                    <Badge variant="secondary" className="inline-flex items-start pt-1 pb-1.5 px-2 bg-slate-100 rounded-md">
                      <span className="text-fiord text-sm">
                        {report.field_workClassName}
                      </span>
                    </Badge>
                  </div>

                  <div className="gap-2 w-full flex flex-col items-start">
                    <div className="flex items-center gap-2 w-full">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-slate-gray text-sm">時間:</span>
                      <span className="text-ebony text-sm">
                        {formatTime(report.field_startTime)}~{formatTime(report.field_endTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <UserIcon className="w-4 h-4" />
                      <span className="text-slate-gray text-sm">作業員:</span>
                      <span className="text-ebony text-sm">
                        {report.field_workerName}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
