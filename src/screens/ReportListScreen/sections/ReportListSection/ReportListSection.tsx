import { ClockIcon, UserIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

const reportData = [
  {
    date: "2025年2月2日（日）",
    reports: [
      {
        id: 1,
        location: "県道123号線 北区間",
        workType: "除雪作業",
        time: "06:00 〜 08:30",
        worker: "田中 太郎",
        hasWarning: true,
      },
      {
        id: 2,
        location: "県道123号線 北区間",
        workType: "除雪作業",
        time: "07:30 〜 10:00",
        worker: "佐藤 次郎",
        hasWarning: true,
      },
      {
        id: 3,
        location: "町道10号線 東エリア",
        workType: "融雪剤散布",
        time: "09:00 〜 11:30",
        worker: "鈴木 花子",
        hasWarning: false,
      },
    ],
  },
  {
    date: "2025年2月1日（土）",
    reports: [
      {
        id: 4,
        location: "県道22号線 西区間",
        workType: "除雪作業",
        time: "05:30 〜 08:00",
        worker: "山田 健一",
        hasWarning: false,
      },
      {
        id: 5,
        location: "町道23号線 南エリア",
        workType: "排雪作業",
        time: "13:00 〜 16:00",
        worker: "高橋 美咲",
        hasWarning: false,
      },
    ],
  },
];

export const ReportListSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[861px] overflow-scroll">
      <div className="flex flex-col w-[calc(100%_-_40px)] mx-5 my-4 gap-3">
        {reportData.map((dateGroup, dateIndex) => (
          <div key={dateIndex} className="flex flex-col gap-3">
            <header className="flex flex-col items-start pt-0 pb-0.5 px-0 w-full">
              <h2 className="w-full mt-[-1.00px] font-inter-semi-bold font-[number:var(--inter-semi-bold-font-weight)] text-slate-gray text-[length:var(--inter-semi-bold-font-size)] tracking-[var(--inter-semi-bold-letter-spacing)] flex items-center justify-center leading-[var(--inter-semi-bold-line-height)] [font-style:var(--inter-semi-bold-font-style)] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
                {dateGroup.date}
              </h2>
            </header>

            {dateGroup.reports.map((report, reportIndex) => (
              <Card
                key={report.id}
                className="w-full bg-white rounded-xl border border-solid border-slate-200 shadow-[0px_1px_3px_#0000001a] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] cursor-pointer hover:shadow-[0px_4px_8px_#0000001a] hover:scale-[1.01] transition-all duration-200"
                onClick={() => navigate("/reportinputscreen")}
              >
                <CardContent className="flex flex-col items-start gap-3 p-[17px] relative">
                  <div className="gap-1 w-full flex flex-col items-start">
                    <div className="flex flex-col items-start pt-0 pb-0.5 px-0 w-full">
                      <h3 className="w-full mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-ebony text-base tracking-[0] flex items-center justify-center leading-[normal]">
                        {report.location}
                      </h3>
                    </div>

                    <Badge
                      variant="secondary"
                      className="inline-flex items-start pt-1 pb-1.5 px-2 bg-slate-100 rounded-md"
                    >
                      <span className="w-fit mt-[-1.00px] font-inter-medium font-[number:var(--inter-medium-font-weight)] text-fiord text-[length:var(--inter-medium-font-size)] tracking-[var(--inter-medium-letter-spacing)] flex items-center justify-center leading-[var(--inter-medium-line-height)] [font-style:var(--inter-medium-font-style)]">
                        {report.workType}
                      </span>
                    </Badge>
                  </div>

                  <div className="gap-2 w-full flex flex-col items-start">
                    <div className="flex items-center gap-2 w-full">
                      <ClockIcon className="w-4 h-4" />

                      <div className="inline-flex flex-col items-start pl-0 pr-1 pt-0 pb-0.5">
                        <span className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-slate-gray text-sm tracking-[0] flex items-center justify-center leading-[normal]">
                          時間:
                        </span>
                      </div>

                      <div className="inline-flex flex-col items-start pt-0 pb-0.5 px-0">
                        <span className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-ebony text-sm tracking-[0] flex items-center justify-center leading-[normal]">
                          {report.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <UserIcon className="w-4 h-4" />

                      <div className="inline-flex flex-col items-start pl-0 pr-1 pt-0 pb-0.5">
                        <span className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-slate-gray text-sm tracking-[0] flex items-center justify-center leading-[normal]">
                          作業員:
                        </span>
                      </div>

                      <div className="inline-flex flex-col items-start pt-0 pb-0.5 px-0">
                        <span className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-ebony text-sm tracking-[0] flex items-center justify-center leading-[normal]">
                          {report.worker}
                        </span>
                      </div>
                    </div>
                  </div>

                  {report.hasWarning && (
                    <Badge className="w-[106px] pt-[5px] pb-1.5 px-[9px] absolute top-[17px] right-[17px] bg-beeswax rounded-md border border-solid border-amber-200 flex flex-col items-start">
                      <span className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-korma text-[11px] tracking-[0] whitespace-nowrap flex items-center justify-center leading-[normal]">
                        同時作業の可能性
                      </span>
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
