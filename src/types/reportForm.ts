export interface ReportGetData {
  field_workerId: string[];
  field_dayReportId: string[] | null;
  field_carId: string[];
  field_CustomerId: string[];
  field_endTime: string;
  field_workClassId: string[];
  field_workDate: string;
  field_totalWorkTime: string | null;
  field_workPlaceId: string[];
  field_weather: string;
  field_workerName: string | null;
  field_assistantId: string[] | null;
  field_assistantName: string | null;
  field_workClassName: string | null;
  field_carName: string | null;
  field_workPlaceName: string | null;
  field_startTime: string;
  field_CompanyName: string;
  field_removalVolume: string ;
  field_tachometerValue?: string | null;
  field_tachometerMemos?: string[] | null;
  field_tachometerImageUrls?: string[] | null;
}


export interface ReportPostData {
  field_workerId: string[];
  field_carId: string[];
  field_CustomerId: string[];
  field_endTime: string;
  field_workClassId: string[];
  field_workDate: string;
  field_workPlaceId: string[];
  field_weather: string;
  field_workerName: string | null;
  field_assistantId: string[] | null;
  field_assistantName: string | null;
  field_workClassName: string | null;
  field_carName: string | null;
  field_workPlaceName: string | null;
  field_startTime: string;
  field_CompanyName: string;
  field_removalVolume: string | null;
  field_tachometerValue?: string | null;
  field_tachometerMemos?: string[] | null;
  field_tachometerImageUrls?: string[] | null;
}

export interface ReportPayload {
  worker_id: string[];
  vehicle_id: string[];
  customer_id: string[];
  end_at: string;
  work_type_id: string[];
  work_date: string;
  work_place_id: string[];
  weather_id: string;
  worker_name: string | null;
  assistant_id: string[] | null;
  assistant_name: string | null;
  work_type_name: string | null;
  vehicle_name: string | null;
  work_place_name: string | null;
  start_at: string;
  company_name: string;
  removal_amount: string | null;
  tachometer_value?: string | null;
  tachometer_memos?: string[] | null;
  tachometer_image_urls?: string[] | null;
}

export interface ReportN8nMetadata {
  tachometer_value?: string;
  tachometer_memos?: string[];
}

export interface RouteGetData {
  field_routeId: string[];
  field_workPlaceId: string[];
  field_workPlaceName: string | null;
  field_workerId: string[];
  field_workerName: string | null;
  field_customerId: string[];
  field_companyName: string | null;
  field_carId: string[];
  field_carName: string | null;
  field_workType: string[];
  field_workClassId: string[];
  field_workClassName: string | null;
  field_categoryId: string[];
  field_categoryName: string | null;
}
