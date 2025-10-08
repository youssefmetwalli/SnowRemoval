import { CarIcon, SettingsIcon, UsersIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const todayStats = [
  {
    value: "3",
    label: "完了作業",
  },
  {
    value: "2",
    label: "進行中",
  },
  {
    value: "8.5h",
    label: "作業時間",
  },
];

const mainMenuItems = [
  {
    title: "新規作成",
    subtitle: "今すぐ入力",
    icon: "✦",
    gradient: true,
    className: "col-span-1 row-span-2",
  },
  {
    title: "日報一覧",
    subtitle: "25件",
    icon: "📋",
    gradient: false,
    className: "col-span-1",
  },
  {
    title: "カレンダー",
    icon: "📅",
    gradient: false,
    className: "col-span-1",
  },
  {
    title: "統計",
    icon: "📊",
    gradient: false,
    className: "col-span-1",
  },
];

const otherMenuItems = [
  {
    title: "作業員管理",
    icon: UsersIcon,
  },
  {
    title: "車両管理",
    icon: CarIcon,
  },
  {
    title: "設定",
    icon: SettingsIcon,
  },
];

export const NavigationMenuSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-8">
      {/* Today's Results */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-6">
          <h2 className="font-semibold text-gray-600 mb-4">今日の実績</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {todayStats.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Menu */}
      <section>
        <h2 className="font-semibold text-gray-600 mb-4">メインメニュー</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Creation */}
          <Card
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:scale-[1.02] transition"
            onClick={() => navigate("/reportinputscreen")}
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square">
              <span className="text-3xl">✦</span>
              <p className="font-semibold">新規作成</p>
              <Badge className="bg-white/20 text-white">今すぐ入力</Badge>
            </CardContent>
          </Card>

          {/* Daily Report List */}
          <Card
            className="cursor-pointer hover:scale-[1.02] transition"
            onClick={() => navigate("/reportlistscreen")}
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square">
              <span className="text-3xl">📋</span>
              <p className="font-semibold">日報一覧</p>
              <Badge className="bg-sky-50 text-blue-500">25件</Badge>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="cursor-pointer hover:scale-[1.02] transition">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square">
              <span className="text-3xl">📅</span>
              <p className="font-semibold">カレンダー</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="cursor-pointer hover:scale-[1.02] transition">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square">
              <span className="text-3xl">📊</span>
              <p className="font-semibold">統計</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Other Menu */}
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
    </div>
  );
};

