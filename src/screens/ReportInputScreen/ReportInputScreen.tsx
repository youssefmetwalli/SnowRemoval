import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { InputConfirmation } from "../InputConfirmation/InputConfirmation";
import { ActionButtonsSection } from "./sections/ActionButtonsSection/ActionButtonsSection";
import { BasicInformationSection } from "./sections/BasicInformationSection/BasicInformationSection";
import { NotificationSection } from "./sections/NotificationSection/NotificationSection";
import { WorkDurationSection } from "./sections/WorkDurationSection/WorkDurationSection";
import { WorkPlaceSection } from "./sections/WorkPlaceSection/WorkPlaceSection";
import { WorkRecordSection } from "./sections/WorkRecordSection/WorkRecordSection";
import { WorkerVehicleSection } from "./sections/WorkerVehicleSection/WorkerVehicleSection";
import type { ReportFormData } from "../../types/reportForm";
import { postReport } from "../../hook/postReport";

export const ReportInputScreen = (): JSX.Element => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReportFormData>({
    defaultValues: {
      field_workerId: [],
      field_dayReportId: [],
      field_carId: [],
      field_CustomerId: [],
      field_endTime: "",
      field_workClassId: [],
      field_workDate: "",
      field_totalWorkTime: "",
      field_workPlaceId: [],
      field_weather: [],
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

  const firstError = useMemo(() => {
    const order: (keyof ReportFormData)[] = [
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
      await postReport(values);
      setShowConfirmation(false);
      // 成功時の処理（例：成功メッセージ表示、ページ遷移など）
      console.log("送信成功");
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
        data={{
          workDate: values.field_workDate,
          workplace: values.field_workPlaceName,
          workClassification: values.field_workClassName,
          startTime: values.field_startTime,
          endTime: values.field_endTime,
          mainPerson: values.field_workerName,
        }}
      />
      <div className="flex flex-col w-full items-center pt-4 pb-8 px-4 sm:px-6 bg-gradient-to-b from-sky-50 to-sky-100">
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

          {/* Top error banner on submit (optional) */}
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
                required: "作業場所を選択してください",
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
            <WorkRecordSection />
            <ActionButtonsSection />
          </form>
        </div>
      </div>
    </>
  );
};
