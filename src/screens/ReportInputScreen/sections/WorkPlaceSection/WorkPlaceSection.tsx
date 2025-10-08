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
import { MapPinIcon } from "lucide-react";

interface Props {
  register: UseFormRegister<ReportFormData>;
  errors: FieldErrors<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  values: ReportFormData;
}

export const WorkPlaceSection = ({
  register,
  errors,
  setValue,
  values,
}: Props): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <MapPinIcon className="w-5 h-5 text-blue-500" />{" "}
          <h2 className="text-lg font-semibold text-gray-500">作業場所</h2>
        </div>

        <div className="space-y-2">
          <Label className="text-lg">
            顧客<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.customer}
            onValueChange={(v) =>
              setValue("customer", v, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="liondor">Lion Dor</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("workplace", { required: "作業場所は必須です" })}
            value={values.workplace}
          />
          {errors.workplace && (
            <p className="text-red-600 text-xs">{errors.workplace.message}</p>
          )}
        </div>
        {/* 作業場所 */}
        <div className="space-y-2">
          <Label className="text-lg">
            作業場所<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.workplace}
            onValueChange={(v) =>
              setValue("workplace", v, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="○○市道 A">○○市道 A</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("workplace", { required: "作業場所は必須です" })}
            value={values.workplace}
          />
          {errors.workplace && (
            <p className="text-red-600 text-xs">{errors.workplace.message}</p>
          )}
        </div>

        {/* 作業分類 */}
        <div className="space-y-2">
          <Label className="text-lg">
            作業分類<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.workClassification}
            onValueChange={(v) =>
              setValue("workClassification", v, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="除雪">除雪</SelectItem>
              <SelectItem value="撒砂">撒砂</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("workClassification", {
              required: "作業分類は必須です",
            })}
            value={values.workClassification}
          />
          {errors.workClassification && (
            <p className="text-red-600 text-xs">
              {errors.workClassification.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
