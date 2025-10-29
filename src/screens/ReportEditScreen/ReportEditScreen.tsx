import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { InputConfirmation } from "../InputConfirmation/InputConfirmation";
import { ActionButtonsSection } from "../../components/reportUi/ActionButtonsSection/ActionButtonsSection";
import { BasicInformationSection } from "../../components/reportUi/BasicInformationSection/BasicInformationSection";
import { NotificationSection } from "../../components/reportUi/NotificationSection/NotificationSection";
import { WorkDurationSection } from "../../components/reportUi/WorkDurationSection/WorkDurationSection";
import { WorkPlaceSection } from "../../components/reportUi/WorkPlaceSection/WorkPlaceSection";
import { WorkRecordSection } from "../../components/reportUi/WorkRecordSection/WorkRecordSection";
import { WorkerVehicleSection } from "../../components/reportUi/WorkerVehicleSection/WorkerVehicleSection";
import type { ReportPostData } from "../../types/reportForm";
import { putReport } from "../../hook/putReport";
import { UserName } from "../../components/UserName";
import { getCurrentUser } from "../../hook/getCurrentUser";

export const ReportEditScreen = (): JSX.Element => {
  const location = useLocation();
  const passed = location.state as Partial<ReportPostData> | undefined;
  const dayReportId: string = location.state.field_dayReportId[1];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {name} = getCurrentUser();

  // ---------- helpers to normalize incoming values ----------
  const isoToDate = (iso?: string) => {
    if (!iso) return "";
    // "2025-10-11T00:00+09:00" -> "2025-10-11"
    const m = iso.match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : iso;
  };
  const isoToTimeHM = (iso?: string) => {
    if (!iso) return "";
    // "2025-10-11T09:30+09:00" -> "09:30"
    const m = iso.match(/T(\d{2}:\d{2})/);
    return m ? m[1] : iso;
  };
  const asArr = (v?: string[] | string | null) =>
    Array.isArray(v) ? v : v ? [String(v)] : [];

  const pickId = (arr?: unknown) => {
    if (!Array.isArray(arr)) return arr as string | undefined;
    const a = arr as string[];
    // prefer ["", "1", "", "1"] -> "1"; otherwise use single-element ["1"]
    return a[1] ?? a[0];
  };

  const normalizeForForm = (p?: Partial<ReportPostData>): ReportPostData => ({
    field_workerId: asArr(p?.field_workerId),
    field_carId: asArr(p?.field_carId),
    field_CustomerId: asArr(p?.field_CustomerId),
    field_endTime: isoToTimeHM(p?.field_endTime),
    field_workClassId: asArr(p?.field_workClassId),
    field_workDate: isoToDate(p?.field_workDate),
    field_workPlaceId: asArr(p?.field_workPlaceId),
    field_weather: Array.isArray(p?.field_weather)
      ? p.field_weather[0] ?? ""
      : p?.field_weather ?? "",
    field_workerName: p?.field_workerName ?? "",
    field_assistantId: asArr(p?.field_assistantId),
    field_assistantName: p?.field_assistantName ?? "",
    field_workClassName: p?.field_workClassName ?? "",
    field_carName: p?.field_carName ?? "",
    field_workPlaceName: p?.field_workPlaceName ?? "",
    field_startTime: isoToTimeHM(p?.field_startTime),
    field_CompanyName: p?.field_CompanyName ?? "",
    field_removalVolume:
      typeof p?.field_removalVolume === "number"
        ? String(p?.field_removalVolume)
        : p?.field_removalVolume ?? "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty = true },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm<ReportPostData>({
    defaultValues: normalizeForForm(passed), // prefill from card click, or blank when none
    mode: "onSubmit",
  });

  useEffect(() => {
    reset(normalizeForForm(passed));
  }, [passed, reset]);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    () => {
      const id = normalizeForForm(passed).field_workPlaceId?.[1];
      return id ? Number(id) : null;
    }
  );

  const values = watch();

  // デバッグログを追加
  // console.log("現在のフォーム値:", values);
  // console.log("field_workerId:", values.field_workerId);
  // console.log("field_carId:", values.field_carId);
  // console.log("field_assistantId:", values.field_assistantId);
  // console.log("isValid:", isValid);
  // console.log("isDirty:", isDirty);
  // console.log("field_assistantId:", values.field_assistantId);

  const toJdbRef = (val?: string | number | null): string[] => {
    if (val === undefined || val === null || val === "") return [];
    const s = String(val);
    return ["", s, "", s];
  };
  // const first = (arr?: unknown) =>
  //   Array.isArray(arr)
  //     ? (arr[0] as string | undefined)
  //     : (arr as string | undefined);

  const nullIfEmpty = (s: string | null | undefined) =>
    s && s.trim() !== "" ? s : null;

  const toIsoDate = (dateStr: string) => {
    if (!dateStr) return "";
    const tzOffset = "+09:00";
    return `${dateStr}T00:00${tzOffset}`;
  };

  const toIsoDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return "";
    const tzOffset = "+09:00";
    return `${dateStr}T${timeStr}${tzOffset}`;
  };

  const toJdbRecord = (v: ReportPostData): ReportPostData => {
    // console.log("toJdbRecord入力:", v);

    const result = {
      field_workerId: toJdbRef(pickId(v.field_workerId)),
      field_carId: toJdbRef(pickId(v.field_carId)),
      field_CustomerId: toJdbRef(pickId(v.field_CustomerId)),
      field_workClassId: toJdbRef(pickId(v.field_workClassId)),
      field_workDate: toIsoDate(v.field_workDate),
      field_workPlaceId: toJdbRef(pickId(v.field_workPlaceId)),
      field_weather: v.field_weather,
      field_workerName: nullIfEmpty(v.field_workerName) as string | null,
      field_assistantId:
        v.field_assistantId && v.field_assistantId.length
          ? toJdbRef(pickId(v.field_assistantId))
          : null,
      field_assistantName: nullIfEmpty(v.field_assistantName) as string | null,
      field_workClassName: nullIfEmpty(v.field_workClassName) as string | null,
      field_carName: nullIfEmpty(v.field_carName) as string | null,
      field_workPlaceName: nullIfEmpty(v.field_workPlaceName) as string | null,
      field_startTime: toIsoDateTime(v.field_workDate, v.field_startTime),
      field_endTime: toIsoDateTime(v.field_workDate, v.field_endTime),
      field_CompanyName: v.field_CompanyName,
      field_removalVolume:
        values.field_removalVolume && Number(values.field_removalVolume) > 0
          ? String(values.field_removalVolume)
          : null,
    };

    // console.log("toJdbRecord出力:", result);
    return result;
  };

  const firstError = useMemo(() => {
    const order: (keyof ReportPostData)[] = [
      "field_workDate",
      "field_weather",
      // "field_CustomerId",
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
  const onInvalid = () => {
    setShowConfirmation(false);
    // console.log("Invalid!");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const record = toJdbRecord(values);
    try {
      // const record = toJdbRecord(values);
      await putReport(record, dayReportId);
      setShowConfirmation(false);
      // console.log("送信成功");
      console.log(record);
      reset();
    } catch (error) {
      console.error("送信エラー:", error);
      console.log(record);
    } finally {
      setIsSubmitting(false);
      // console.log("送信完了");
      // console.log(record);
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
            title="日報編集"
            navigateTo="/reportlistscreen"
            workerName={name}
            selectedLocationId={selectedLocationId}
            onLocationSelect={(loc) => {
              setSelectedLocationId(loc.id);
              setValue("field_workPlaceId", [String(loc.id)], {
                shouldDirty: true,
              });
              setValue("field_workPlaceName", loc.name, { shouldDirty: true });
              clearErrors("field_workPlaceId");
            }}
            
          />

          {firstError && (
            <Alert className="bg-red-50 border-red-200 text-red-700">
              <AlertDescription>{firstError}</AlertDescription>
            </Alert>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onValid, onInvalid)}
            noValidate
          >
            <input
              type="hidden"
              value={selectedLocationId ?? ""}
              {...register("field_workPlaceId", {
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

            <ActionButtonsSection
              isValid={isValid}
              isDirty={true} //TODO 内容が変更されたらボタンが押せるように修正
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </div>
    </>
  );
};
