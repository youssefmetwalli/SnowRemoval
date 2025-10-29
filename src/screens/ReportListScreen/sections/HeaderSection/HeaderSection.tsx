import React from "react";
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  LayersIcon,
  FilterIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";

import type { ReportListFilters } from "../../ReportListScreen";
import { MobileFilterDialog } from "./MobileFilterDialog";

type Props = {
  filters: ReportListFilters;
  onChangeFilters: (f: ReportListFilters) => void;
};

export const HeaderSection: React.FC<Props> = ({ filters, onChangeFilters }) => {
  const navigate = useNavigate();
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // helper for updating individual filters
  const setFilter =
    <K extends keyof ReportListFilters>(key: K) =>
    (v: string) =>
      onChangeFilters({ ...filters, [key]: v });

  // apply button in dialog (just close)
  const handleApplyMobileFilters = () => {
    setMobileFilterOpen(false);
  };

  // キャンセル = clear all filters then close
  const handleClearAndClose = () => {
    onChangeFilters({
      query: "",
      date: "",
      classification: "",
      location: "",
    });
    setMobileFilterOpen(false);
  };

  return (
    <>
      <header className="flex flex-col w-full gap-4 pt-5 pb-5 px-5 shadow-[0px_2px_4px_#0000001a] bg-[linear-gradient(158deg,rgba(59,130,246,1)_0%,rgba(37,99,235,1)_100%)]">
        {/* Top Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 bg-white/20 rounded-xl hover:bg-white/30 transition-colors flex-shrink-0"
              onClick={() => navigate("/homescreen")}
              aria-label="戻る"
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
            </Button>

            {/* Title */}
            <div className="flex flex-col">
              <div className="text-white font-semibold text-lg leading-none">
                作業日報一覧
              </div>
            </div>
          </div>

          {/* Filter icon button (mobile only) */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-white/20 rounded-xl hover:bg-white/30 flex-shrink-0 md:hidden"
            aria-label="フィルター"
            onClick={() => setMobileFilterOpen(true)}
          >
            <FilterIcon className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Keyword search (always visible) */}
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={filters.query}
            onChange={(e) => setFilter("query")(e.target.value)}
            placeholder="キーワード検索（作業場所 / 作業分類 / 作業員 など）"
            className="pl-10 bg-white h-12 text-[16px] rounded-lg shadow-sm"
          />
        </div>

        {/* Desktop filter row */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-3 w-full">
          {/* 日付 */}
          <div className="flex flex-col">
            <Label className="flex items-center gap-2 text-sm text-white mb-1 font-medium">
              <CalendarIcon className="w-4 h-4 text-white" />
              <span className="text-white">日付</span>
            </Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilter("date")(e.target.value)}
              className="bg-white h-12 text-[16px] rounded-lg shadow-sm"
            />
          </div>

          {/* 作業分類 */}
          <div className="flex flex-col">
            <Label className="flex items-center gap-2 text-sm text-white mb-1 font-medium">
              <LayersIcon className="w-4 h-4 text-white" />
              <span className="text-white">作業分類</span>
            </Label>
            <Input
              placeholder="例: 除雪 / 撒砂"
              value={filters.classification}
              onChange={(e) => setFilter("classification")(e.target.value)}
              className="bg-white h-12 text-[16px] rounded-lg shadow-sm placeholder:text-gray-400"
            />
          </div>

          {/* 作業場所 */}
          <div className="flex flex-col">
            <Label className="flex items-center gap-2 text-sm text-white mb-1 font-medium">
              <MapPinIcon className="w-4 h-4 text-white" />
              <span className="text-white">作業場所</span>
            </Label>
            <Input
              placeholder="例: ○○市道 / 県道123号"
              value={filters.location}
              onChange={(e) => setFilter("location")(e.target.value)}
              className="bg-white h-12 text-[16px] rounded-lg shadow-sm placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Mobile-only filter dialog */}
      <MobileFilterDialog
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        filters={filters}
        setFilter={setFilter}
        onApply={handleApplyMobileFilters}
        onClearAndClose={handleClearAndClose}
      />
    </>
  );
};
