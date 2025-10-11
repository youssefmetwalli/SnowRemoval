import { BarChart3Icon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { ReportPostData } from "../../../../types/reportForm";

interface Props {
  register: UseFormRegister<ReportPostData>;
  errors: FieldErrors<ReportPostData>;
  setValue: UseFormSetValue<ReportPostData>;
  values: ReportPostData;
}

export const WorkRecordSection = ({ register, errors }: Props): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-5">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-1">
          <BarChart3Icon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">作業実績</h2>
        </div>

        {/* 除雪量 */}
        <div className="space-y-1.5">
          <Label className="text-sm">除雪量</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="decimal"
              step="10"
              min={0}
              className="h-11 w-full rounded-md border border-gray-300 text-base"
              placeholder="0"
              {...register("field_removalVolume", {

                validate: (v) => {
                  if (v === "" || v == null) return true; 
                  return Number(v) >= 0 || "0以上で入力してください";
                },
              })}
            />
            <span className="h-11 px-3 inline-flex items-center rounded-md border border-gray-300 text-gray-600 bg-gray-50">
              cm
            </span>
          </div>
          {errors.field_removalVolume && (
            <p className="text-red-600 text-xs">
              {String(errors.field_removalVolume.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-lg">備考</Label>
          <Textarea
            placeholder="特記事項があれば入力してください"
            className="min-h-28 w-full rounded-md border border-gray-300 text-base placeholder:text-gray-400 resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
};
