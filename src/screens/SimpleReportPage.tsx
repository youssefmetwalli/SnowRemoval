import React, { useState } from "react";
import { getReport } from "../hook/getReport";
import { postReport } from "../hook/postReport";
import {ReportPostData} from "../types/reportForm";

const mockReportFormData: ReportPostData = {
  field_workerId: ["", "1", "", "1"],
  field_carId: ["", "2", "", "2"],
  field_CustomerId: ["", "4", "", "4"],
  field_endTime: "2024-12-01T17:30+09:00",
  field_workClassId: ["", "1", "", "1"],
  field_workDate: "2024-12-01T00:00+00:00",
  field_workPlaceId: ["", "1", "", "1"],
  field_weather: "晴れ",
  field_workerName: "作業員A",
  field_assistantId: ["","2","","2"],
  field_assistantName: "作業員C",
  field_workClassName: "除雪",
  field_carName: "H-1",
  field_workPlaceName: "リオンドール",
  field_startTime: "2024-12-01T09:30+09:00",
  field_CompanyName: "（株）会津",
  field_removalVolume: "2.5",
};

const SimpleReportPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await postReport(mockReportFormData);
      console.log("送信成功", response);
      setSubmitResult("送信成功しました！");
    } catch (error) {
      console.error("送信エラー:", error);
      setSubmitResult("送信エラーが発生しました");
    } finally {
      console.log("送信完了");
      setIsSubmitting(false);
    }
  };

  const { data, isLoading, isError } = getReport();

  return (
    <div style={{ padding: "20px" }}>
      <h1>レポート画面</h1>

      {/* 送信ボタン - onClickに変更 */}
      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        style={{
          padding: "10px 20px",
          backgroundColor: isSubmitting ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "送信中..." : "送信ボタン"}
      </button>

      {/* 送信結果表示 */}
      {submitResult && (
        <p
          style={{
            color: submitResult.includes("成功") ? "green" : "red",
            marginTop: "10px",
          }}
        >
          {submitResult}
        </p>
      )}

      <br />
      <br />

      {/* データ取得ボタン */}
      <button
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading ? "#ccc" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "取得中..." : "データ取得"}
      </button>

      {isError && <p style={{ color: "red" }}>エラーが発生しました</p>}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>結果:</h2>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* デバッグ用：送信するデータを表示 */}
      <div style={{ marginTop: "20px" }}>
        <h3>送信予定データ:</h3>
        <pre
          style={{
            backgroundColor: "#f0f8ff",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(mockReportFormData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SimpleReportPage;
