import React from "react";
import {
  CalendarIcon,
  LayersIcon,
  MapPinIcon,
  XIcon,
} from "lucide-react";

import { Dialog, DialogContent, DialogOverlay, DialogClose } from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import type { ReportListFilters } from "../../ReportListScreen";

type MobileFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  filters: ReportListFilters;
  setFilter: <K extends keyof ReportListFilters>(key: K) => (v: string) => void;

  onApply: () => void;           // 検索
  onClearAndClose: () => void;   // キャンセル（リセット+閉じる）
};

export const MobileFilterDialog: React.FC<MobileFilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  setFilter,
  onApply,
  onClearAndClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay
        className="
          fixed inset-0 bg-black/50 backdrop-blur-[2px]
          data-[state=open]:animate-in data-[state=open]:fade-in-0
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          duration-200
        "
      />
      <DialogContent
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md
          rounded-2xl bg-white shadow-2xl border border-gray-200 p-5
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          duration-200
        "
      >
        {/* header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-gray-900 font-semibold text-base">
            絞り込み条件
          </div>

          <DialogClose asChild>
            <button
              className="
                inline-flex items-center justify-center
                w-8 h-8 rounded-md
                text-gray-400
                transition-colors
              "
              aria-label="閉じる"
            >
            </button>
          </DialogClose>
        </div>

        {/* fields */}
        <div className="flex flex-col gap-4">
          {/* 日付 */}
          <div className="flex flex-col">
            <Label className="flex items-center gap-2 text-[13px] text-gray-700 mb-1 font-medium">
              <CalendarIcon className="w-4 h-4 text-gray-700" />
              <span>日付</span>
            </Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilter("date")(e.target.value)}
              className="h-11 text-[15px] rounded-md border border-gray-300"
            />
          </div>

          {/* 作業分類 */}
          <div className="flex flex-col">
            <Label className="flex items-center gap-2 text-[13px] text-gray-700 mb-1 font-medium">
              <LayersIcon className="w-4 h-4 text-gray-700" />
              <span>作業分類</span>
            </Label>
            <Input
              placeholder="例: 除雪 / 撒砂"
              value={filters.classification}
              onChange={(e) => setFilter("classification")(e.target.value)}
              className="h-11 text-[15px] rounded-md border border-gray-300 placeholder:text-gray-400"
            />
          </div>

          {/* 作業場所 */}
          <div className="flex flex-col">
            <Label className="flex items-center gap-2 text-[13px] text-gray-700 mb-1 font-medium">
              <MapPinIcon className="w-4 h-4 text-gray-700" />
              <span>作業場所</span>
            </Label>
            <Input
              placeholder="例: ○○市道 / 県道123号"
              value={filters.location}
              onChange={(e) => setFilter("location")(e.target.value)}
              className="h-11 text-[15px] rounded-md border border-gray-300 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* footer buttons */}
        <div className="flex justify-center gap-3 mt-6">
          {/* 検索 */}
          <Button
            className="
              h-11 px-5 rounded-lg shadow-[0px_4px_12px_#3b82f64c]
              bg-gradient-to-r from-blue-500 to-blue-600 text-white
              font-bold text-[15px] hover:opacity-90
            "
            onClick={onApply}
          >
            検索
          </Button>

          {/* キャンセル */}
          <Button
            variant="outline"
            className="
              h-11 px-4 rounded-lg border border-gray-300 bg-white
              text-gray-700 text-[15px] font-medium shadow-sm
              hover:bg-gray-50
            "
            onClick={onClearAndClose}
          >
            キャンセル
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
