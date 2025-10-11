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
import type { ReportPostData } from "../../../../types/reportForm";
import { MapPinIcon } from "lucide-react";

interface Props {
  register: UseFormRegister<ReportPostData>;
  errors: FieldErrors<ReportPostData>;
  setValue: UseFormSetValue<ReportPostData>;
  values: ReportPostData;
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
          <MapPinIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">作業場所</h2>
        </div>

        {/* 顧客 (field_CustomerId / field_CompanyName) */}
        <div className="space-y-2">
          <Label className="text-sm">
            顧客<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.field_CompanyName ?? ""}
            onValueChange={(v) => {
              setValue("field_CompanyName", v, { shouldValidate: true });
              const idMap: Record<string, string> = {
                "Lion Dor": "4",
              };
              setValue("field_CustomerId", [idMap[v] ?? ""], {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lion Dor">Lion Dor</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("field_CompanyName", { required: "顧客は必須です" })}
            value={values.field_CompanyName ?? ""}
          />
          {errors.field_CompanyName && (
            <p className="text-red-600 text-xs">
              {errors.field_CompanyName.message}
            </p>
          )}
        </div>

        {/* 作業場所 (field_workPlaceId / field_workPlaceName) */}
        <div className="space-y-2">
          <Label className="text-sm">
            作業場所<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.field_workPlaceName ?? ""}
            onValueChange={(v) => {
              setValue("field_workPlaceName", v, { shouldValidate: true });
              const idMap: Record<string, string> = {
                "○○市道 A": "1",
              };
              setValue("field_workPlaceId", [idMap[v] ?? ""], {
                shouldValidate: true,
              });
            }}
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
            {...register("field_workPlaceName", { required: "作業場所は必須です" })}
            value={values.field_workPlaceName ?? ""}
          />
          {errors.field_workPlaceName && (
            <p className="text-red-600 text-xs">
              {errors.field_workPlaceName.message}
            </p>
          )}
        </div>

        {/* 作業分類 (field_workClassId / field_workClassName) */}
        <div className="space-y-2">
          <Label className="text-sm">
            作業分類<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.field_workClassName ?? ""}
            onValueChange={(v) => {
              setValue("field_workClassName", v, { shouldValidate: true });
              const idMap: Record<string, string> = {
                除雪: "1",
                撒砂: "2",
              };
              setValue("field_workClassId", [idMap[v] ?? ""], {
                shouldValidate: true,
              });
            }}
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
            {...register("field_workClassName", {
              required: "作業分類は必須です",
            })}
            value={values.field_workClassName ?? ""}
          />
          {errors.field_workClassName && (
            <p className="text-red-600 text-xs">
              {errors.field_workClassName.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
