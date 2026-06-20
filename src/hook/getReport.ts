import { useEffect, useState } from "react";
import { ReportGetData } from "../types/reportForm";
import { apiClient } from "../lib/apiClient";

export const useReport = (userName?: string | undefined | null) => {
  const [data, setData] = useState<ReportGetData[]>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // all=true で全件取得
        const res = await apiClient.get<{ data: any[] }>("reports?all=true");
        const reports = res.data || [];

        let filtered = reports;
        if (userName) {
          const lowerUser = userName.toLowerCase();
          filtered = reports.filter(
            (r) =>
              r.worker?.workerName?.toLowerCase() === lowerUser ||
              r.assistant?.workerName?.toLowerCase() === lowerUser
          );
        }

        const transformed = filtered.map((r) => ({
          field_workerId: ["", String(r.workerId), "", String(r.workerId)],
          field_dayReportId: ["", String(r.id), "", String(r.id)],
          field_carId: ["", String(r.carId), "", String(r.carId)],
          field_CustomerId: r.customerId ? ["", String(r.customerId), "", String(r.customerId)] : [],
          field_endTime: r.end_at,
          field_workClassId: ["", String(r.classificationId), "", String(r.classificationId)],
          field_workDate: r.work_date,
          field_totalWorkTime: null,
          field_workPlaceId: ["", String(r.workPlaceId), "", String(r.workPlaceId)],
          field_weather: r.weather?.weatherName ?? "",
          field_workerName: r.worker?.workerName ?? null,
          field_assistantId: r.assistantId ? ["", String(r.assistantId), "", String(r.assistantId)] : null,
          field_assistantName: r.assistant?.workerName ?? null,
          field_workClassName: r.work_type?.workTypeName ?? null,
          field_carName: r.vehicle?.carName ?? null,
          field_workPlaceName: r.workPlace?.workPlaceName ?? null,
          field_startTime: r.start_at,
          field_CompanyName: r.customer?.companyName ?? "",
          field_removalVolume: r.removal_amount ? String(r.removal_amount) : "",
          field_tachometerValue: r.TachometerImageUrl || null,
          field_tachometerMemos: r.TachometerNotes || [],
          field_tachometerImageUrls: r.TachometerImageUrl ? [r.TachometerImageUrl] : [],
        }));

        setData(transformed);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [userName]);

  return { data, isLoading, isError };
};
