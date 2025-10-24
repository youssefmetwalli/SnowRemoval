import { UserIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { ReportPostData } from "../../../types/reportForm";
import { getWorker } from "../../../hook/getWorkers";

interface Props {
  register: UseFormRegister<ReportPostData>;
  errors: FieldErrors<ReportPostData>;
  setValue: UseFormSetValue<ReportPostData>;
  values: ReportPostData;
}

export const WorkerVehicleSection = ({
  register,
  errors,
  setValue,
  values,
}: Props): JSX.Element => {
  const { data: workerData, isLoading, isError } = getWorker();

  const workers = workerData?.map((workerData, index) => ({
    id: workerData.field_1754635302,
    name: workerData.field_1754549790 ?? "名称未設定",
  }));

  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <UserIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">作業員・車両</h2>
        </div>

        {/* 主担当 (field_workerName / field_workerId) */}
        <div className="space-y-2">
          <Label className="text-sm">
            主担当<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.field_workerName ?? ""}
            onValueChange={(v) => {
              // name
              const w = workers?.find(
                worker => worker.name === v
              );
              
              setValue("field_workerName", v ?? "", { shouldValidate: true });
              // matching ID (for example purposes)
              // const idMap: Record<string, string> = {
              //   "田中 太郎": "1",
              //   "佐藤 花子": "2",
              // };
              setValue("field_workerId", w?.id ?? [""], {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {workers?.map((w, index) => (
                <SelectItem value={w.name}>{w.name}</SelectItem>
              ))}
              {/* <SelectItem value="田中 太郎">田中 太郎</SelectItem>
              <SelectItem value="佐藤 花子">佐藤 花子</SelectItem> */}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("field_workerName", { required: "主担当は必須です" })}
            value={values.field_workerName ?? ""}
          />
          {errors.field_workerName && (
            <p className="text-red-600 text-xs">
              {errors.field_workerName.message}
            </p>
          )}
        </div>

        {/* 助手 (field_assistantName / field_assistantId) */}
        <div className="space-y-2">
          <Label className="text-sm">助手</Label>
          <Select
            value={values.field_assistantName ?? ""}
            onValueChange={(v) => {
              const w = workers?.find(
                worker => worker.name === v
              );

              setValue("field_assistantName", v || null);
              // const idMap: Record<string, string> = {
              //   "山田 次郎": "3",
              // };
              setValue("field_assistantId", w?.id ?? null,  {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {workers?.map((w, index) => (
                <SelectItem value={w.name}>{w.name}</SelectItem>
              ))}
              {/* <SelectItem value="山田 次郎">山田 次郎</SelectItem>
              <SelectItem value="なし">(なし)</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* 車両 (field_carName / field_carId) */}
        <div className="space-y-2">
          <Label className="text-sm">
            車両<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={values.field_carName ?? ""}
            onValueChange={(v) => {
              setValue("field_carName", v, { shouldValidate: true });
              const idMap: Record<string, string> = {
                除雪車A号: "1",
                除雪車B号: "2",
              };
              setValue("field_carId", [idMap[v] ?? ""], {
                shouldValidate: true,
              });
            }}
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
            {...register("field_carName", { required: "車両は必須です" })}
            value={values.field_carName ?? ""}
          />
          {errors.field_carName && (
            <p className="text-red-600 text-xs">
              {errors.field_carName.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
