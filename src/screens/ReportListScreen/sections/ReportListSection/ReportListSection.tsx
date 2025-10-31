// ReportListSection.tsx
import { ClockIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { useReport } from "../../../../hook/getReport";
import React from "react";
import { formatDateJP, formatTimeJP } from "../../../../lib/datetime";
import { useReportList } from "../../../../hook/useReportList";
import { ReportListFilters } from "../../../../types/listFilters";

type Props = {
  filters: ReportListFilters;
};

export const ReportListSection: React.FC<Props> = ({ filters }) => {
  const navigate = useNavigate();
  const { data: reports } = useReport();

  const { grouped } = useReportList(reports, filters);

  return (
    <div className="w-full h-[861px] overflow-scroll">
      <div className="flex flex-col w-[calc(100%_-_40px)] mx-5 my-4 gap-3">
        {grouped.map(([dateKey, list], idx) => (
          <div key={dateKey + idx} className="flex flex-col gap-3">
            <header className="flex flex-col items-start pt-0 pb-0.5 px-0 w-full">
              <h2 className="w-full font-semibold text-slate-600 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
                {formatDateJP(dateKey)}
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
                        {formatTimeJP(report.field_startTime)}~
                        {formatTimeJP(report.field_endTime)}
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
