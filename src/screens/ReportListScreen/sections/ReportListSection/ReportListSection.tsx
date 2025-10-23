import { ClockIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { useReport } from "../../../../hook/getReport";

export const ReportListSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: reports, isLoading, isError } = useReport(); // ✅ use the hook properly

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "—";
    const time = new Date(timeString);
    return time.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (isLoading)
    return <div className="p-4 text-gray-500 text-center">読み込み中...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600 text-center">
        データ取得に失敗しました。
      </div>
    );
  if (!reports?.length)
    return (
      <div className="p-4 text-gray-500 text-center">
        レポートがありません。
      </div>
    );

  const loginUser = localStorage.getItem("loggedInUser");
  const parsedLoginUser = JSON.parse(loginUser!);
  const loginUserReports = reports.filter(
    (report) => 
      parsedLoginUser.field_1754635302[1] === report.field_workerId[1]
  );

  // Group by date
  const grouped = loginUserReports.reduce<Record<string, typeof reports>>(
    (acc, report) => {
      const date = report.field_workDate?.split("T")[0] ?? "未設定";
      if (!acc[date]) acc[date] = [];
      acc[date].push(report);
      return acc;
    },
    {}
  );

  return (
    <div className="w-full h-[861px] overflow-y-auto">
      <div className="flex flex-col w-[calc(100%-40px)] mx-5 my-4 gap-3">
        {Object.entries(grouped)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) //  newest first
          .map(([date, dayReports], dateIndex) => (
            <div key={dateIndex} className="flex flex-col gap-3">
              <header className="flex flex-col items-start">
                <h2 className="font-semibold text-slate-gray text-base">
                  {formatDate(date)}
                </h2>
              </header>

              {dayReports.map((report, reportIndex) => (
                <Card
                  key={reportIndex}
                  className="w-full bg-white rounded-xl border border-slate-200 shadow hover:shadow-lg cursor-pointer hover:scale-[1.01] transition-all duration-200"
                  onClick={() => navigate("/reporteditscreen", { state: report })}
                >
                  <CardContent className="flex flex-col gap-3 p-[17px] relative">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-ebony text-base">
                        {report.field_workPlaceName || "—"}
                      </h3>

                      <Badge variant="secondary" className="bg-slate-100">
                        {report.field_workClassName || "—"}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>時間:</span>
                        <span>
                          {formatTime(report.field_startTime)}〜
                          {formatTime(report.field_endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>作業員:</span>
                        <span>{report.field_workerName || "—"}</span>
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
