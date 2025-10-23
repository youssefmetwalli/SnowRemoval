import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { FilterSection } from "./sections/FilterSection/FilterSection";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection";
import { ReportListSection } from "./sections/ReportListSection/ReportListSection";
import { UserName } from "../../components/UserName";
import { ReportFilter } from "../../types/filterType";
import { useState } from "react";



export const ReportListScreen = (): JSX.Element => {
  const [filter, setFilter] = useState<ReportFilter>({});
  const navigate = useNavigate();

  return (
   <div className="flex flex-col w-full items-center pt-4 pb-8 px-4 sm:px-6 bg-gradient-to-b from-sky-50 to-sky-100">
    <UserName />
      <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] w-full">
        <HeaderSection />
      </div>

      <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms] w-full">
        <FilterSection />
      </div>

      <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms] w-full flex-1">
        <ReportListSection />
      </div>

      <div className="flex flex-col w-[335px] items-start fixed left-5 bottom-6 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
        <Button 
          className="relative w-full h-14 rounded-xl shadow-[0px_4px_12px_#3b82f64c] bg-[linear-gradient(178deg,rgba(59,130,246,1)_0%,rgba(37,99,235,1)_100%)] hover:bg-[linear-gradient(178deg,rgba(59,130,246,0.9)_0%,rgba(37,99,235,0.9)_100%)] hover:shadow-[0px_6px_16px_#3b82f64c] hover:scale-[1.02] border-0 transition-all duration-200"
          onClick={() => navigate("/reportinputscreen")}
        >
          <PlusIcon className="w-6 h-6 text-white mr-2" />
          <span className="[font-family:'Arial-Bold',Helvetica] font-bold text-white text-base">
            新規作成
          </span>
        </Button>
      </div>
    </div>
  );
};
