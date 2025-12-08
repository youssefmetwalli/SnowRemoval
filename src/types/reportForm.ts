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
}

export interface RouteGetData {
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