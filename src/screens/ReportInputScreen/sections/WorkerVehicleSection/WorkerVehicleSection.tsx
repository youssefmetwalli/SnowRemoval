import { UserIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
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

export const WorkerVehicleSection = ({
  register,
  errors,
  setValue,
  values,
}: Props): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <UserIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-500">作業員・車両</h2>
        </div>
        {/* 主担当 */}
        <div className="space-y-2">
          <Label className="text-lg">
            主担当<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.mainPerson}
            onValueChange={(v) =>
              setValue("mainPerson", v, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="田中 太郎">田中 太郎</SelectItem>
              <SelectItem value="佐藤 花子">佐藤 花子</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("mainPerson", { required: "主担当は必須です" })}
            value={values.mainPerson}
          />
          {errors.mainPerson && (
            <p className="text-red-600 text-xs">{errors.mainPerson.message}</p>
          )}
        </div>

        {/* 助手 */}
        <div className="space-y-2">
          <Label className="text-lg">助手</Label>
          <Select
            value={values.assistant}
            onValueChange={(v) => setValue("assistant", v)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="山田 次郎">山田 次郎</SelectItem>
              <SelectItem value="(なし)">(なし)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 車両 */}
        <div className="space-y-2">
          <Label className="text-lg">
            車両<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.vehicle}
            onValueChange={(v) =>
              setValue("vehicle", v, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="除雪車A号">除雪車A号</SelectItem>
              <SelectItem value="除雪車B号">除雪車B号</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("vehicle", { required: "車両は必須です" })}
            value={values.vehicle}
          />
          {errors.vehicle && (
            <p className="text-red-600 text-xs">{errors.vehicle.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
