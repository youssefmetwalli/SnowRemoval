import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { ReportPostData } from "../../../types/reportForm";
import { ClockIcon } from "lucide-react";

interface Props {
  register: UseFormRegister<ReportPostData>;
  errors: FieldErrors<ReportPostData>;
  setValue: UseFormSetValue<ReportPostData>;
  values: ReportPostData;
}

export const WorkDurationSection = ({
  register,
  errors,
}: Props): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ClockIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">作業時間</h2>
        </div>

        {/* 開始時間 (field_startTime) */}
        <div className="space-y-2">
          <Label className="text-sm">
            開始時間<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="time"
            className="h-11 w-full text-base rounded-md border border-gray-300"
            {...register("field_startTime", {
              required: "開始時間は必須です",
            })}
          />
          {errors.field_startTime && (
            <p className="text-red-600 text-xs">
              {errors.field_startTime.message}
            </p>
          )}
        </div>

        {/* 終了時間 (field_endTime) */}
        <div className="space-y-2">
          <Label className="text-sm">
            終了時間<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="time"
            className="h-11 w-full text-base rounded-md border border-gray-300"
            {...register("field_endTime", {
              required: "終了時間は必須です",
              validate: (v, formValues) => {
                const start = formValues.field_startTime;
                if (!v || !start) return true;
                return (
                  v > start || "終了時間は開始時間より後にしてください"
                );
              },
            })}
          />
          {errors.field_endTime && (
            <p className="text-red-600 text-xs">
              {errors.field_endTime.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
