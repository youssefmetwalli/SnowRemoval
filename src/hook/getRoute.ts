import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { RouteGetData } from "../types/reportForm";

export const useRoute = (userName: string | undefined) => {
  const [data, setData] = useState<RouteGetData[] | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<any[]>("masters/routes");

        let filtered = res;
        if (userName) {
          const lowerUser = userName.toLowerCase();
          filtered = res.filter(
            (r) => r.worker?.workerName?.toLowerCase() === lowerUser
          );
        }

        const transformed = filtered.map((v) => {
          const wpRelation = v.routeWorkPlaces?.[0]?.workPlace;
          return {
            field_routeId: ["", String(v.id), "", String(v.id)],
            field_workPlaceId: wpRelation
              ? ["", String(wpRelation.id), "", String(wpRelation.id)]
              : [],
            field_workPlaceName: wpRelation?.workPlaceName ?? null,
            field_workerId: ["", String(v.worker.id), "", String(v.worker.id)],
            field_workerName: v.worker.workerName,
            field_customerId: wpRelation
              ? ["", String(wpRelation.customerId), "", String(wpRelation.customerId)]
              : [],
            field_companyName: wpRelation?.customer?.companyName ?? null,
            field_carId: ["", String(v.vehicle.id), "", String(v.vehicle.id)],
            field_carName: v.vehicle.carName,
            field_workType: ["", String(v.workType.id), "", String(v.workType.id)],
            field_workClassId: ["", String(v.workType.id), "", String(v.workType.id)],
            field_workClassName: v.workType.workTypeName,
            field_categoryId: ["", String(v.classification.id), "", String(v.classification.id)],
            field_categoryName: v.classification.classificationName,
          };
        });

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