import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  LayersIcon,
  FilterIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import React from "react";
import type { ReportListFilters } from "../../ReportListScreen";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  filters: ReportListFilters;
  onChangeFilters: (f: ReportListFilters) => void;
};

export const HeaderSection: React.FC<Props> = ({ filters, onChangeFilters }) => {
  const navigate = useNavigate();

  const set =
    <K extends keyof ReportListFilters>(key: K) =>
    (v: string) =>
      onChangeFilters({ ...filters, [key]: v });

  return (
    <header className="flex flex-col w-full items-start gap-4 pt-5 pb-4 px-5 relative shadow-[0px_2px_4px_#0000001a] bg-[linear-gradient(158deg,rgba(59,130,246,1)_0%,rgba(37,99,235,1)_100%)] translate-y-[-1rem] animate-fade-in opacity-0">
      {/* Top bar */}
            <div className="flex items-center justify-between pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 bg-white-20 rounded-lg hover:bg-white-20/80 transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:100ms]"
            onClick={() => navigate("/homescreen")}
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Button>
          
          <div className="inline-flex flex-col items-start pt-px pb-0.5 px-0 relative flex-[0_0_auto] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          <div className="relative w-fit mt-[-1.00px] font-semantic-heading-1 font-[number:var(--semantic-heading-1-font-weight)] text-white text-[length:var(--semantic-heading-1-font-size)] tracking-[var(--semantic-heading-1-letter-spacing)] whitespace-nowrap flex items-center justify-center leading-[var(--semantic-heading-1-line-height)] [font-style:var(--semantic-heading-1-font-style)]">
            作業日報一覧
          </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 bg-white-20 rounded-lg hover:bg-white-20/80 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]"
        >
          <FilterIcon className="w-5 h-5 text-white" />
        </Button>
      </div>


      {/* Search & filters row */}
      <div className="flex flex-col w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms] gap-3">
        {/* Free text search */}
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={filters.query}
            onChange={(e) => set("query")(e.target.value)}
            placeholder="キーワード検索（作業場所 / 作業分類 / 作業員 など）"
            className="pl-9 bg-white"
          />
        </div>

        {/* Date / classification / location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="flex items-center gap-2 text-sm text-white/90 mb-1">
              <CalendarIcon className="w-4 h-4" /> 日付
            </Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => set("date")(e.target.value)}
              className="bg-white"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-sm text-white/90 mb-1">
              <LayersIcon className="w-4 h-4" /> 作業分類
            </Label>
            <Input
              placeholder="例: 除雪 / 撒砂"
              value={filters.classification}
              onChange={(e) => set("classification")(e.target.value)}
              className="bg-white"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-sm text-white/90 mb-1">
              <MapPinIcon className="w-4 h-4" /> 作業場所
            </Label>
            <Input
              placeholder=""
              value={filters.location}
              onChange={(e) => set("location")(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
