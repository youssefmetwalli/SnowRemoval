import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { ReportFormData } from "../../../../types/reportForm";

interface Props {
  register: UseFormRegister<ReportFormData>;
  errors: FieldErrors<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  values: ReportFormData;
}

export const BasicInformationSection = ({
  register,
  errors,
  setValue,
  values,
}: Props): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">基本情報</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 *:min-w-0">
          {/* 日付 */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              日付<span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                className="pl-9 w-full h-11 text-base rounded-md border border-gray-300"
                {...register("workDate", { required: "日付は必須です" })}
              />
            </div>
            {errors.workDate && (
              <p className="text-red-600 text-xs">{errors.workDate.message}</p>
            )}
          </div>

          {/* 天気 */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              天気<span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={values.weather}
              onValueChange={(v) =>
                setValue("weather", v, { shouldValidate: true })
              }
            >
              <SelectTrigger className="h-11 w-full text-base rounded-md border border-gray-300">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="雪">雪</SelectItem>
                <SelectItem value="晴れ">晴れ</SelectItem>
                <SelectItem value="曇り">曇り</SelectItem>
                <SelectItem value="雨">雨</SelectItem>
              </SelectContent>
            </Select>
            {!values.weather && errors.weather && (
              <p className="text-red-600 text-xs">{errors.weather.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
