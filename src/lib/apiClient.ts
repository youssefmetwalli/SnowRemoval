type JsonRecord = Record<string, any>;

const API_BASE = "/api/v1";

const ref = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value === null || value === undefined || value === "") return [];
  const id = String(value);
  return ["", id, "", id];
};

const firstValue = (item: JsonRecord, keys: string[]) => {
  for (const key of keys) {
    if (item[key] !== undefined) return item[key];
  }
  return undefined;
};

const normalizeList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.records)) return data.records;
  return data ? [data] : [];
};

const unwrapRecord = (item: any) =>
  item && typeof item === "object" && "record" in item ? item.record : item;

const mapWorker = (item: JsonRecord) =>
  "field_1754635302" in item
    ? item
    : {
        field_1754635302: ref(firstValue(item, ["worker_id", "workerId", "id"])),
        field_1754549790:
          firstValue(item, ["worker_name", "workerName", "name"]) ?? "",
        field_1754550088:
          firstValue(item, ["login_id", "loginId", "code"]) ?? "",
      };

const mapVehicle = (item: JsonRecord) =>
  "field_2002120021" in item
    ? item
    : {
        field_2002120021: ref(firstValue(item, ["vehicle_id", "vehicleId", "id"])),
        field_2003520035:
          firstValue(item, ["vehicle_name", "vehicleName", "car_name", "name"]) ??
          null,
        field_1754972826:
          firstValue(item, ["vehicle_number", "vehicleNumber", "car_number", "number"]) ??
          "",
        field_2001820018:
          firstValue(item, ["maker_name", "makerName", "maker"]) ?? null,
        field_1754977233: firstValue(item, ["remarks", "memo"]) ?? null,
      };

const mapCustomer = (item: JsonRecord) =>
  "field_2001720017" in item
    ? item
    : {
        field_2001720017: ref(firstValue(item, ["customer_id", "customerId", "id"])),
        field_2002520025: firstValue(item, ["address"]) ?? "",
        field_2003120031: firstValue(item, ["phone_number", "phoneNumber", "phone"]) ?? "",
        field_1754541737:
          firstValue(item, ["company_name", "companyName", "name"]) ?? "",
        field_1754547084:
          firstValue(item, ["president_name", "presidentName"]) ?? "",
        field_1754547099:
          firstValue(item, ["representative_name", "representativeName"]) ?? "",
      };

const mapWorkPlace = (item: JsonRecord) =>
  "field_2002320023" in item
    ? item
    : {
        field_2002320023: ref(firstValue(item, ["work_place_id", "workPlaceId", "id"])),
        field_2001920019:
          firstValue(item, ["work_place_name", "workPlaceName", "name"]) ?? null,
        field_1756792186: ref(firstValue(item, ["customer_id", "customerId"])),
        field_1754541737:
          firstValue(item, ["company_name", "companyName", "customer_name"]) ?? null,
        field_2003120031:
          firstValue(item, ["phone_number", "phoneNumber", "phone"]) ?? null,
      };

const mapWorkType = (item: JsonRecord) =>
  "field_2000820008" in item
    ? item
    : {
        field_2000820008: ref(firstValue(item, ["work_type_id", "workTypeId", "id"])),
        field_2001620016:
          firstValue(item, ["work_type_name", "workTypeName", "name"]) ?? null,
      };

const mapRoute = (item: JsonRecord) =>
  "field_routeId" in item
    ? item
    : {
        field_routeId: ref(firstValue(item, ["route_id", "routeId", "id"])),
        field_workPlaceId: ref(firstValue(item, ["work_place_id", "workPlaceId"])),
        field_workPlaceName:
          firstValue(item, ["work_place_name", "workPlaceName"]) ?? null,
        field_workerId: ref(firstValue(item, ["worker_id", "workerId"])),
        field_workerName: firstValue(item, ["worker_name", "workerName"]) ?? null,
        field_customerId: ref(firstValue(item, ["customer_id", "customerId"])),
        field_companyName:
          firstValue(item, ["company_name", "companyName"]) ?? null,
        field_carId: ref(firstValue(item, ["vehicle_id", "vehicleId", "car_id", "carId"])),
        field_carName:
          firstValue(item, ["vehicle_name", "vehicleName", "car_name", "carName"]) ??
          null,
        field_workType: ref(firstValue(item, ["work_type", "workType"])),
        field_workClassId: ref(firstValue(item, ["work_type_id", "workTypeId"])),
        field_workClassName:
          firstValue(item, ["work_type_name", "workTypeName"]) ?? null,
        field_categoryId: ref(firstValue(item, ["category_id", "categoryId"])),
        field_categoryName:
          firstValue(item, ["category_name", "categoryName"]) ?? null,
      };

const mapReport = (item: JsonRecord) =>
  "field_workerId" in item
    ? item
    : {
        field_workerId: ref(firstValue(item, ["worker_id", "workerId"])),
        field_dayReportId: ref(firstValue(item, ["daily_report_id", "dayReportId", "id"])),
        field_carId: ref(firstValue(item, ["vehicle_id", "vehicleId", "car_id", "carId"])),
        field_CustomerId: ref(firstValue(item, ["customer_id", "customerId"])),
        field_endTime: firstValue(item, ["end_at", "endAt"]) ?? "",
        field_workClassId: ref(firstValue(item, ["work_type_id", "workTypeId"])),
        field_workDate: firstValue(item, ["work_date", "workDate"]) ?? "",
        field_totalWorkTime:
          firstValue(item, ["total_work_time", "totalWorkTime"]) ?? null,
        field_workPlaceId: ref(firstValue(item, ["work_place_id", "workPlaceId"])),
        field_weather: firstValue(item, ["weather_id", "weatherId", "weather"]) ?? "",
        field_workerName: firstValue(item, ["worker_name", "workerName"]) ?? null,
        field_assistantId: firstValue(item, ["assistant_id", "assistantId"]) === null
          ? null
          : ref(firstValue(item, ["assistant_id", "assistantId"])),
        field_assistantName:
          firstValue(item, ["assistant_name", "assistantName"]) ?? null,
        field_workClassName:
          firstValue(item, ["work_type_name", "workTypeName"]) ?? null,
        field_carName:
          firstValue(item, ["vehicle_name", "vehicleName", "car_name", "carName"]) ??
          null,
        field_workPlaceName:
          firstValue(item, ["work_place_name", "workPlaceName"]) ?? null,
        field_startTime: firstValue(item, ["start_at", "startAt"]) ?? "",
        field_CompanyName: firstValue(item, ["company_name", "companyName"]) ?? "",
        field_removalVolume:
          firstValue(item, ["removal_amount", "removalAmount"]) ?? null,
        field_tachometerValue:
          firstValue(item, ["tachometer_value", "tachometerValue"]) ?? null,
        field_tachometerMemos:
          firstValue(item, ["tachometer_memos", "tachometerMemos"]) ?? null,
        field_tachometerImageUrls:
          firstValue(item, ["image_urls", "imageUrls"]) ?? null,
      };

const normalizers: Record<string, (item: JsonRecord) => JsonRecord> = {
  workers: mapWorker,
  vehicles: mapVehicle,
  customers: mapCustomer,
  "work-places": mapWorkPlace,
  "work-types": mapWorkType,
  routes: mapRoute,
  reports: mapReport,
};

const toApiEndpoint = (endpoint: string) => endpoint.replace(/^\/+/, "");

const legacyReportToSnake = (data: JsonRecord) => ({
  worker_id: data.field_workerId,
  vehicle_id: data.field_carId,
  customer_id: data.field_CustomerId,
  end_at: data.field_endTime,
  work_type_id: data.field_workClassId,
  work_date: data.field_workDate,
  work_place_id: data.field_workPlaceId,
  weather_id: data.field_weather,
  worker_name: data.field_workerName,
  assistant_id: data.field_assistantId,
  assistant_name: data.field_assistantName,
  work_type_name: data.field_workClassName,
  vehicle_name: data.field_carName,
  work_place_name: data.field_workPlaceName,
  start_at: data.field_startTime,
  company_name: data.field_CompanyName,
  removal_amount: data.field_removalVolume,
});

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  private normalizeResponse<T>(endpoint: string, data: any): T {
    const resource = toApiEndpoint(endpoint).split("?")[0];
    const normalizeItem = normalizers[resource];
    const items = normalizeList(data).map(unwrapRecord);

    if (!normalizeItem) {
      return (Array.isArray(data) || Array.isArray(data?.data) || Array.isArray(data?.items)
        ? items
        : unwrapRecord(data)) as T;
    }

    const normalized = items.map((item) =>
      item && typeof item === "object" ? normalizeItem(item) : item
    );
    return normalized as T;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const apiEndpoint = toApiEndpoint(endpoint);
    const url = `${this.baseUrl}/${apiEndpoint}`;
    const headers =
      options.body instanceof FormData
        ? options.headers
        : {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          };

    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`HTTP error! status: ${response.status}, body:${bodyText}`);
    }

    const text = await response.text();
    const json = text ? JSON.parse(text) : null;
    return this.normalizeResponse<T>(endpoint, json);
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    const apiEndpoint = toApiEndpoint(endpoint);
    const body =
      apiEndpoint.split("?")[0] === "reports" && data?.field_workerId
        ? legacyReportToSnake(data)
        : data;

    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, data: any, _fieldname?: string, id?: string): Promise<T> {
    const apiEndpoint = toApiEndpoint(endpoint);
    const resource = apiEndpoint.split("?")[0];
    const targetEndpoint = id && resource === "reports" ? `${resource}/${id}` : endpoint;
    const body = resource === "reports" && data?.field_workerId
      ? legacyReportToSnake(data)
      : data;

    return this.request<T>(targetEndpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
