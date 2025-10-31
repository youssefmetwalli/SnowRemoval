export type ReportListFilters = {
  query: string;            // free text (any word/char)
  date: string;             // YYYY-MM-DD
  classification: string;   // 作業分類
  location: string;         // 作業場所
};

type ReportString = string | null | undefined;

export type ReportLike = {
  field_workDate: ReportString;           
  field_startTime?: ReportString;        
  field_endTime?: ReportString;           
  field_workPlaceName?: ReportString;     
  field_workClassName?: ReportString;    
  field_workerName?: ReportString;        
};
