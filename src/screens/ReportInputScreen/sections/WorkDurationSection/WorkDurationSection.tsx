import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { ReportFormData } from "../../../../types/reportForm";
import { ClockIcon } from "lucide-react";

interface Props {
  register: UseFormRegister<ReportFormData>;
  errors: FieldErrors<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  values: ReportFormData;
}

export const WorkDurationSection = ({
  register,
  errors,
}: Props): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ClockIcon className="w-5 h-5 text-blue-500" />{" "}
          <h2 className="text-lg font-semibold text-gray-500">作業員・車両</h2>
        </div>
        {/* 開始時間 */}
        <div className="space-y-2">
          <Label className="text-lg">
            開始時間<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="time"
            {...register("startTime", { required: "開始時間は必須です" })}
          />
          {errors.startTime && (
            <p className="text-red-600 text-xs">{errors.startTime.message}</p>
          )}
        </div>

        {/* 終了時間 */}
        <div className="space-y-2">
          <Label className="text-lg">
            終了時間<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="time"
            {...register("endTime", {
              required: "終了時間は必須です",
              validate: (v, values) => {
                // Optional: ensure end after start
                if (!v || !values.startTime) return true;
                return (
                  v > values.startTime ||
                  "終了時間は開始時間より後にしてください"
                );
              },
            })}
          />
          {errors.endTime && (
            <p className="text-red-600 text-xs">{errors.endTime.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
