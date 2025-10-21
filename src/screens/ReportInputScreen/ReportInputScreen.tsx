import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { InputConfirmation } from "../InputConfirmation/InputConfirmation";
import { ActionButtonsSection } from "../../components/reportUi/ActionButtonsSection/ActionButtonsSection";
import { BasicInformationSection } from "../../components/reportUi/BasicInformationSection/BasicInformationSection";
import { NotificationSection } from "../../components/reportUi/NotificationSection/NotificationSection";
import { WorkDurationSection } from "../../components/reportUi/WorkDurationSection/WorkDurationSection";
import { WorkPlaceSection } from "../../components/reportUi/WorkPlaceSection/WorkPlaceSection";
import { WorkRecordSection } from "../../components/reportUi/WorkRecordSection/WorkRecordSection";
import type { ReportPostData } from "../../types/reportForm";
import { postReport } from "../../hook/postReport";
import { WorkerVehicleSection } from "../../components/reportUi/WorkerVehicleSection/WorkerVehicleSection";
import { UserName } from "../../components/UserName";

export const ReportInputScreen = (): JSX.Element => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReportPostData>({
    defaultValues: {
      field_workerId: [],
      field_carId: [],
      field_CustomerId: [],
      field_endTime: "",
      field_workClassId: [],
      field_workDate: "",
      field_workPlaceId: [],
      field_weather: "",
      field_workerName: "",
      field_assistantId: [],
      field_assistantName: "",
      field_workClassName: "",
      field_carName: "",
      field_workPlaceName: "",
      field_startTime: "",
      field_CompanyName: "",
      field_removalVolume: "",
    },
    mode: "onSubmit",
  });

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const values = watch();

  const toJdbRef = (val?: string | number | null): string[] => {
    if (val === undefined || val === null || val === "") return [];
    const s = String(val);
    return ["", s, "", s];
  };
  const first = (arr?: unknown) =>
    Array.isArray(arr)
      ? (arr[0] as string | undefined)
      : (arr as string | undefined);

  const nullIfEmpty = (s: string | null | undefined) =>
    s && s.trim() !== "" ? s : null;

  const toIsoDate = (dateStr: string) => {
    if (!dateStr) return "";
    const tzOffset = "+09:00"; // adjust if needed for your region
    return `${dateStr}T00:00${tzOffset}`;
  };

  const toIsoDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return "";
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      const tzOffset = "+09:00";
      return `${dateStr}T${timeStr}${tzOffset}`;
    } catch {
      return "";
    }
  };

  const toJdbRecord = (v: ReportPostData): ReportPostData => ({
    field_workerId: toJdbRef(first(v.field_workerId)),
    field_carId: toJdbRef(first(v.field_carId)),
    field_CustomerId: toJdbRef(first(v.field_CustomerId)),
    field_workClassId: toJdbRef(first(v.field_workClassId)),
    field_workDate: toIsoDate(v.field_workDate),
    field_workPlaceId: toJdbRef(first(v.field_workPlaceId)),
    field_weather: v.field_weather,
    field_workerName: nullIfEmpty(v.field_workerName) as string | null,
    field_assistantId:
      v.field_assistantId && v.field_assistantId.length
        ? toJdbRef(first(v.field_assistantId))
        : null,
    field_assistantName: nullIfEmpty(v.field_assistantName) as string | null,
    field_workClassName: nullIfEmpty(v.field_workClassName) as string | null,
    field_carName: nullIfEmpty(v.field_carName) as string | null,
    field_workPlaceName: nullIfEmpty(v.field_workPlaceName) as string | null,
    field_startTime: toIsoDateTime(v.field_workDate, v.field_startTime),
    field_endTime: toIsoDateTime(v.field_workDate, v.field_endTime),
    field_CompanyName: v.field_CompanyName,
    field_removalVolume: v.field_removalVolume ? v.field_removalVolume : null,
  });

  const firstError = useMemo(() => {
    const order: (keyof ReportPostData)[] = [
      "field_workDate",
      "field_weather",
      "field_CustomerId",
      "field_workPlaceName",
      "field_workClassName",
      "field_workerName",
      "field_carName",
      "field_startTime",
      "field_endTime",
    ];
    const key = order.find((k) => errors[k]);
    return key ? (errors[key]?.message as string | undefined) : undefined;
  }, [errors]);

  const onValid = () => setShowConfirmation(true);
  const onInvalid = () => setShowConfirmation(false);

  const handleConfirm = async () => {
    try {
      const record = toJdbRecord(values);
      await postReport(record);
      setShowConfirmation(false);
      console.log("送信成功");
      reset();
    } catch (error) {
      console.error("送信エラー:", error);
    } finally {
      console.log("送信完了");
    }
  };

  return (
    <>
      <InputConfirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirm}
        data={{
          workDate: values.field_workDate,
          workplace: values.field_workPlaceName ?? "",
          workClassification: values.field_workClassName ?? "",
          startTime: values.field_startTime,
          endTime: values.field_endTime,
          mainPerson: values.field_workerName ?? "",
        }}
      />

      <div className="flex flex-col w-full items-center pt-4 pb-8 px-4 sm:px-6 bg-gradient-to-b from-sky-50 to-sky-100">
        <UserName />
        <div className="w-full max-w-4xl space-y-6">
          <NotificationSection
            selectedLocationId={selectedLocationId}
            onLocationSelect={(loc) => {
              setSelectedLocationId(loc.id);
              setValue("field_workPlaceId", [String(loc.id)], {
                shouldValidate: true,
              });
              setValue("field_workPlaceName", loc.name, {
                shouldValidate: true,
              });
            }}
            error={errors.field_workPlaceId?.message}
          />

          {firstError && (
            <Alert className="bg-red-50 border-red-200 text-red-700">
              <AlertDescription>{firstError}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onValid, onInvalid)}
            className="space-y-6"
            noValidate
          >
            <input
              type="hidden"
              value={selectedLocationId ?? ""}
              {...register("field_workPlaceId", {
                required:
                  "作業場所を選択してください (ここと下のドロップダウンから)",
              })}
            />

            <BasicInformationSection
              register={register}
              errors={errors}
              setValue={setValue}
              values={values}
            />
            <WorkerVehicleSection
              register={register}
              errors={errors}
              setValue={setValue}
              values={values}
            />
            <WorkPlaceSection
              register={register}
              errors={errors}
              setValue={setValue}
              values={values}
            />
            <WorkDurationSection
              register={register}
              errors={errors}
              setValue={setValue}
              values={values}
            />
            <WorkRecordSection
              register={register}
              errors={errors}
              setValue={setValue}
              values={values}
            />

            <ActionButtonsSection />
          </form>
        </div>
      </div>
    </>
  );
};
