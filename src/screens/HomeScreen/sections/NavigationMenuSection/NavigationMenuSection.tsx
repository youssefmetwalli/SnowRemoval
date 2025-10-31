import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/card";
import { useReport } from "../../../../hook/getReport";
import { MenuTile } from "../../../../components/ui/menuTile";

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
    </div>
  );
};
