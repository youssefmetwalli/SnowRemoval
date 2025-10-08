import { CheckIcon } from "lucide-react";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
} from "../../components/ui/dialog";

type ConfirmationData = {
  workDate?: string;
  workplace?: string;
  workClassification?: string;
  startTime?: string;
  endTime?: string;
  mainPerson?: string;
};

interface InputConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ConfirmationData;
}

const fmtDate = (val?: string) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fmtTimeRange = (start?: string, end?: string) => {
  const s = start && start.length ? start : "—";
  const e = end && end.length ? end : "—";
  return `${s} ～ ${e}`;
};

export const InputConfirmation: React.FC<InputConfirmationProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  const details = useMemo(
    () => [
      { label: "作業日", value: fmtDate(data.workDate) },
      { label: "作業場所", value: data.workplace || "—" },
      { label: "作業分類", value: data.workClassification || "—" },
      { label: "作業時間", value: fmtTimeRange(data.startTime, data.endTime) },
      { label: "作業員", value: data.mainPerson || "—" },
    ],
    [data]
  );
  const navigate = useNavigate();
  const handleSave = () => {
    onOpenChange(false);
    setTimeout(() => navigate("/homescreen"), 200);
  };

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
          p-0 gap-0 max-w-[360px] border-0 bg-transparent shadow-none
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-2
          duration-200
        "
      >
        {/* Modal card */}
        <div className="w-full bg-gradient-to-b from-white to-gray-50 rounded-2xl overflow-hidden shadow-2xl border border-gray-300 p-6 flex flex-col items-center space-y-6">
          {/* Icon */}
          <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
            <CheckIcon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h2 className="font-semibold text-gray-900 text-lg">保存確認</h2>
            <p className="text-gray-500 text-sm">この内容で保存しますか？</p>
          </div>

          {/* Details */}
          <Card className="w-full bg-white border border-gray-400 shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-1">
              {details.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 border-b last:border-b-0 border-gray-300"
                >
                  <span className="text-gray-500 text-xs">{d.label}</span>
                  <span className="font-semibold text-gray-800 text-[13px]">
                    {d.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 w-full">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="h-11 flex-1 bg-gray-200 text-gray-700 rounded-[10px] hover:bg-gray-400"
              >
                キャンセル
              </Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              className="h-11 flex-1 rounded-[10px] shadow-[0px_4px_6px_#3b82f640] bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:opacity-60 transition-opacity"
            >
              保存する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
