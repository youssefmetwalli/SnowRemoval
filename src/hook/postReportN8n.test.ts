import { describe, expect, it } from "vitest";
import { transformToSnakeCase } from "./postReportN8n";
import type { ReportPostData } from "../types/reportForm";

const baseInput = (): ReportPostData => ({
  field_workerId: ["worker", "5"],
  field_carId: ["car", "12"],
  field_CustomerId: ["customer", "7"],
  field_endTime: "18:30",
  field_workClassId: ["workclass", "3"],
  field_workDate: "2026-07-24",
  field_workPlaceId: ["workplace", "9"],
  field_weather: "雪",
  field_workerName: "山田太郎",
  field_assistantId: null,
  field_assistantName: null,
  field_workClassName: "除雪",
  field_carName: "10t トラック",
  field_workPlaceName: "本社前",
  field_startTime: "06:00",
  field_CompanyName: "テスト株式会社",
  field_removalVolume: "12",
});

describe("transformToSnakeCase", () => {
  it("workerRef 4要素配列の [1] を worker_id に採用する", () => {
    const out = transformToSnakeCase(baseInput());
    expect(out.worker_id).toBe(5);
    expect(out.car_id).toBe(12);
    expect(out.customer_id).toBe(7);
    expect(out.work_class_id).toBe(3);
    expect(out.work_place_id).toBe(9);
  });

  it("weather の日本語ラベルを weatherMap の数値 ID に変換する", () => {
    expect(transformToSnakeCase({ ...baseInput(), field_weather: "晴れ" }).weather_id).toBe(1);
    expect(transformToSnakeCase({ ...baseInput(), field_weather: "曇り" }).weather_id).toBe(2);
    expect(transformToSnakeCase({ ...baseInput(), field_weather: "雨" }).weather_id).toBe(3);
    expect(transformToSnakeCase({ ...baseInput(), field_weather: "雪" }).weather_id).toBe(4);
    expect(transformToSnakeCase({ ...baseInput(), field_weather: "吹雪" }).weather_id).toBe(5);
    expect(transformToSnakeCase({ ...baseInput(), field_weather: "みぞれ" }).weather_id).toBe(6);
  });

  it("未定義天候はデフォルト 1 (晴れ) にフォールバックする", () => {
    const out = transformToSnakeCase({ ...baseInput(), field_weather: "曇天猛吹雪" });
    expect(out.weather_id).toBe(1);
  });

  it("start_time / end_time は JST タイムゾーン付き ISO 文字列になる", () => {
    const out = transformToSnakeCase(baseInput());
    expect(out.start_time).toBe("2026-07-24T06:00+09:00");
    expect(out.end_time).toBe("2026-07-24T18:30+09:00");
  });

  it("空文字の workerName / assistantName は null になる", () => {
    const out = transformToSnakeCase({
      ...baseInput(),
      field_workerName: "",
      field_assistantName: "   ",
    });
    expect(out.worker_name).toBeNull();
    expect(out.assistant_name).toBeNull();
  });

  it("removalVolume は 0 以下なら null、正数なら文字列", () => {
    expect(transformToSnakeCase({ ...baseInput(), field_removalVolume: "0" }).removal_volume).toBeNull();
    expect(transformToSnakeCase({ ...baseInput(), field_removalVolume: "" }).removal_volume).toBeNull();
    expect(transformToSnakeCase({ ...baseInput(), field_removalVolume: "8" }).removal_volume).toBe("8");
  });

  it("tachometer_value / tachometer_notes は options 経由で入る", () => {
    const out = transformToSnakeCase(baseInput(), {
      tachometerValue: "12345",
      tachometerMemos: ["朝の巡回", "夕方の巡回"],
    });
    expect(out.tachometer_value).toBe("12345");
    expect(out.tachometer_notes).toEqual(["朝の巡回", "夕方の巡回"]);
  });

  it("workerRef が 1 要素配列でも pickId は数値に変換する", () => {
    const out = transformToSnakeCase({
      ...baseInput(),
      field_workerId: ["42"],
    });
    expect(out.worker_id).toBe(42);
  });

  it("assistant_id は空配列や null なら null になる", () => {
    expect(transformToSnakeCase({ ...baseInput(), field_assistantId: null }).assistant_id).toBeNull();
    expect(transformToSnakeCase({ ...baseInput(), field_assistantId: [] }).assistant_id).toBeNull();
  });
});
