import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { useReport } from "../../../../hook/getReport";

// const todayStats = [
//   { value: "3", label: "完了作業" },
//   { value: "2", label: "進行中" },
//   { value: "8.5h", label: "作業時間" },
// ];

type MenuTileProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

const MenuTile = ({
  title,
  subtitle,
  icon,
  onClick,
  variant = "secondary",
}: MenuTileProps) => (
  <Card
    onClick={onClick}
    className={[
      "group cursor-pointer transition duration-200",
      "border-slate-200 hover:shadow-lg hover:-translate-y-0.5",
      "ring-0 hover:ring-2 hover:ring-blue-200/80",
      variant === "primary"
        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        : "bg-white",
    ].join(" ")}
  >
    <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-[5/2] sm:aspect-[4/3] lg:aspect-[5/3]">
      <div
        className={[
          "flex items-center justify-center rounded-2xl",
          "w-12 h-2 text-2xl",
          variant === "primary"
            ? "bg-white/15"
            : "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
        ].join(" ")}
        aria-hidden
      >
        {icon}
      </div>
      <p
        className={
          variant === "primary"
            ? "font-semibold"
            : "font-semibold text-slate-700"
        }
      >
        {title}
      </p>
      {subtitle ? (
        <Badge
          className={
            variant === "primary"
              ? "bg-white/20 text-white"
              : "bg-sky-50 text-blue-600"
          }
        >
          {subtitle}
        </Badge>
      ) : null}
    </CardContent>
  </Card>
);

export const NavigationMenuSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: reports, isLoading, isError } = useReport();
  if (isLoading)
    return <div className="p-4 text-gray-500 text-center">読み込み中...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600 text-center">
        データ取得に失敗しました。
      </div>
    );
  // if (!reports?.length)
  //   return (
  //     <div className="p-4 text-gray-500 text-center">
  //       レポートがありません。
  //     </div>
  //   );

  const loginUser = localStorage.getItem("loggedInUser");
  let userReports = null;
  let totalWorkTime = 0;
  let reportCount:number = 0;

  if (loginUser) {
    const parsedLoginUser = JSON.parse(loginUser);
    // console.log(parsedLoginUser.field_1754635302[1]);
    if (reports) {
      userReports = reports.filter((report) => 
        report.field_workerId[1] === parsedLoginUser.field_1754635302[1]
      );
    }
    if (userReports) {
      userReports.map((report) => {
        totalWorkTime += parseInt(report.field_totalWorkTime? report.field_totalWorkTime : "0")
        reportCount++;
      });
  }
    
    // console.log(userReports);
  }

  return (
    <div className="w-full space-y-8">
      {/* Today's Results */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-6">
          <h2 className="font-semibold text-gray-600 mb-4">今日の実績</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{userReports?.length}</p>
              <p className="text-sm text-gray-500">完了作業</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalWorkTime}</p>
              <p className="text-sm text-gray-500">作業時間</p>
            </div>
            {/* {userReports?.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))} */}
          </div>
        </CardContent>
      </Card>

      {/* Main Menu */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold text-gray-600">メインメニュー</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MenuTile
            variant="primary"
            title="新規作成"
            subtitle="今すぐ入力"
            icon={<span className="text-2xl">✦</span>}
            onClick={() => navigate("/reportinputscreen")}
          />

          <MenuTile
            title="日報一覧"
            // subtitle={`${reportCount}件`}
            icon={<span className="text-2xl">📋</span>}
            onClick={() => navigate("/reportlistscreen")}
          />
        </div>
      </section>

      {/* Other Menu*/}
      {/*
      <section>
        <h2 className="font-semibold text-gray-600 mb-4">その他</h2>
        <div className="space-y-3">
          {otherMenuItems.map((item, i) => (
            <Button key={i} variant="outline" className="w-full justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {item.icon === UsersIcon ? "👥" : item.icon === CarIcon ? "🚗" : "⚙"}
                </span>
                <span>{item.title}</span>
              </div>
              <span className="text-gray-400">›</span>
            </Button>
          ))}
        </div>
      </section>
      */}

      {/* Calendar */}
      {/*
      <Card className="cursor-pointer hover:scale-[1.02] transition">
        <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square">
          <span className="text-3xl">📅</span>
          <p className="font-semibold">カレンダー</p>
        </CardContent>
      </Card>
      */}

      {/* Stats */}
      {/*
      <Card className="cursor-pointer hover:scale-[1.02] transition">
        <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square">
          <span className="text-3xl">📊</span>
          <p className="font-semibold">統計</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
};
