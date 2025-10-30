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
import { MapPinIcon } from "lucide-react";
import { getWorkPlace } from "../../../hook/getWorkPlace";
import { getWorkClass } from "../../../hook/getWorkClass";
import { useState, useEffect, useCallback } from "react";

interface Props {
  register: UseFormRegister<ReportPostData>;
  errors: FieldErrors<ReportPostData>;
  setValue: UseFormSetValue<ReportPostData>;
  values: ReportPostData;
  onLocationSelect?: (location: { id: number; }) => void;
  selectedLocationId?: number | null;
}

export const WorkPlaceSection = ({
  register,
  errors,
  setValue,
  values,
  onLocationSelect,
  selectedLocationId
}: Props): JSX.Element => {
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(
      selectedLocationId ?? null
    );


  const {
    data: workPlaceData,
    isLoading: isLoadingWorkPlace,
    isError: isErrorWorkPlace,
  } = getWorkPlace();
  const workPlaces = workPlaceData?.map((workPlaceData, index) => ({
    id: workPlaceData.field_2002320023,
    name: workPlaceData.field_2001920019 ?? "名称未設定",
    customerId: workPlaceData.field_1756792186,
    companyName: workPlaceData.field_1754541737,
  }));

  const {
    data: workClassData,
    isLoading: isLoadingWorkClass,
    isError: isErrorWorkClass,
  } = getWorkClass();
  const workClasses = workClassData?.map((workClassData, index) => ({
    id: workClassData.field_2000820008,
    name: workClassData.field_2001620016 ?? "名称未設定",
  }));

  useEffect(() => {
      if (selectedLocationId !== undefined) {
        setInternalSelectedId(selectedLocationId ?? null);
      }
    }, [selectedLocationId]);
  
    const handleSelect = useCallback(
      (loc: { id: number;}) => {
        if (selectedLocationId === undefined) setInternalSelectedId(loc.id);
        onLocationSelect?.(loc);
      },
      [onLocationSelect, selectedLocationId]
    );

  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <MapPinIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">作業場所</h2>
        </div>

        {/* 作業場所 (field_workPlaceId / field_workPlaceName) */}
        <div className="space-y-2">
          <Label className="text-sm">
            作業場所
            {/* <span className="text-red-500 ml-1">*</span> */}
          </Label>
          <Select
            value={values.field_workPlaceName ?? ""}
            onValueChange={(v) => {
              setValue("field_workPlaceName", v, { shouldValidate: true });
              const selectedWorkPlace = workPlaces?.find(
                (workPlace) => workPlace.name === v
              );
              setValue("field_workPlaceId", selectedWorkPlace?.id ?? [""], {
                shouldValidate: true,
              });
              setValue(
                "field_CustomerId",
                selectedWorkPlace?.customerId ?? [""]
              );
              setValue(
                "field_CompanyName",
                selectedWorkPlace?.companyName ?? ""
              );
              handleSelect({ id: Number(selectedWorkPlace?.id[1])});
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {workPlaces?.map((workPlace, index) => (
                <SelectItem key={workPlace.id[1]} value={workPlace.name}>
                  {workPlace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register(
              "field_workPlaceName"
              // { required: "作業場所は必須です" }
            )}
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
              const wc = workClasses?.find((workClass) => workClass.name === v);
              setValue("field_workClassId", wc?.id ?? [""], {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {workClasses?.map((wc, index) => (
                <SelectItem key={wc.id[1]} value={wc.name}>
                  {wc.name}
                </SelectItem>
              ))}
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
