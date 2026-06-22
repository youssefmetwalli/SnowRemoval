# SnowRemoval データベース定義書 (現状)

## 0. ドキュメント情報

| 項目 | 内容 |
|------|------|
| プロジェクト名 | SnowRemoval (除雪業務管理システム / フロント) |
| 対象 | **現時点 (refactor/87-use-josetsu-api ブランチ) のフロント側データ構造** |
| 状態 | 移行途上 (JustDB 由来の旧表現 と josetsu_console 由来の新表現が混在) |
| Source of Truth | `src/types/*.ts` および `src/hook/*.ts` の TypeScript 型定義 |
| 作成日 | 2026-06-22 |

## 1. 本書の位置付け

### 1.1 もう一冊との関係

本リポジトリには 2 冊の DB 定義書が存在する。**役割が異なる**ので使い分けること。

| ファイル | 表すもの | 用途 |
|---------|---------|------|
| `database-specification.md` | **移行先**: josetsu_console (Prisma + PostgreSQL) | 「最終的に SnowRemoval が合わせていく仕様」 |
| **`database-specification-current.md` (本書)** | **現状**: SnowRemoval フロントが実コードで扱っているデータ構造 | 「いま動いている形を映したもの・比較用」 |

両者の差分が refactor の残作業量。

### 1.2 重要な前提

- SnowRemoval フロント自身は DB を持たない。「定義書」とは言うが、本書が記述するのは **フロントが TypeScript 型と localStorage で扱っているデータ表現**である。
- 認識を簡単にするため、本書では「エンティティ」「テーブル」という語を josetsu_console 側と対応する単位で使う。

## 2. 全体像

### 2.1 データの流れ (現状)

```
┌─────────────────────────────────────────────────┐
│ ユーザー (現場作業員)                            │
└─────────────┬───────────────────────────────────┘
              │ フォーム入力
              ↓
┌─────────────────────────────────────────────────┐
│ React Form (HH:MM, YYYY-MM-DD, field_* 命名)   │
└─────────────┬───────────────────────────────────┘
              │ submit
              ↓
┌─────────────────────────────────────────────────┐
│ transformToSnakeCase() (postReportN8n.ts)       │
│ - field_workerId → worker_id                    │
│ - ref 配列 ["", "123", "", "123"] → 123         │
│ - HH:MM + YYYY-MM-DD → ISO8601 +09:00           │
│ - 天気文字列 → weather_id INTEGER                │
└─────────────┬───────────────────────────────────┘
              │ POST/PUT JSON
              ↓
┌─────────────────────────────────────────────────┐
│ /api/v1/* または /n8n/webhook/report-submit     │
│ (Cloudflare Tunnel → josetsu_console)           │
└─────────────────────────────────────────────────┘

オフライン時:
  ↓
localStorage: report_offline_queue (QueuedRecord[])
  ↑ navigator.onLine 復旧で再送信
```

### 2.2 現状の特徴サマリ

| 特徴 | 内容 | 経緯 |
|------|------|------|
| `field_*` 命名 | フォーム内部の項目名がすべて `field_XXXXX` 形式 | 旧 JustDB のフィールド ID 命名規則の名残 |
| ref 配列形式の ID | `["", "123", "", "123"]` の 4 要素配列で ID を保持 | 旧 JustDB のレコード参照形式 |
| 数字のみのフィールド名 | `field_2002120021` のようなものが残る | 旧 JustDB のフィールド自動採番 ID |
| 大文字 C の混在 | `field_CustomerId`, `field_CompanyName` だけ大文字始まり | スキーマ移行時の表記揺れ |
| 変換層に集約 | snake_case 変換・天気文字列→ID・時刻 ISO 化は `postReportN8n.ts` に集中 | 過渡的な処理。最終的には不要になる想定 |
| エンティティが少ない | classification, weather, contractor がフロント型に存在しない | フォーム上は文字列扱い (例: 天気は inline で id にマップ) |

## 3. エンティティ詳細 (現状)

### 3.1 CurrentUser (ログインユーザー)

**実体:** ログイン中のアプリ利用者情報。`localStorage["snowremovalUser"]` に JSON 保存。

| フィールド | 型 | 内容 |
|-----------|-----|------|
| `id` | string | 作業員 ID (worker テーブルの id) |
| `name` | string | 表示名 |
| `workerRef` | string[] | JustDB ref 形式の自分 ID。`["", String(id), "", String(id)]` |

**出典:** [src/hook/getCurrentUser.ts](../src/hook/getCurrentUser.ts)

**取得経路:** `GET /api/v1/auth/me` → `storeCurrentUser()` で localStorage に書き込み

**josetsu_console 対応:** `workers` テーブル (一部フィールドのみ保持)

### 3.2 Worker (作業員マスタ)

**実体:** ドロップダウン用の作業員一覧。

| フロント側フィールド名 | 型 | API レスポンス値 |
|-------------------|-----|----------------|
| `field_1754635302` | string[] | ref 配列形式の worker.id |
| `field_1754549790` | string | `workerName` |
| `field_1754550088` | string | `loginId ?? ""` |

**出典:** [src/types/worker.ts](../src/types/worker.ts), [src/hook/getWorkers.ts](../src/hook/getWorkers.ts)

**取得経路:** `GET /api/v1/masters/workers`

**josetsu_console 対応:** `workers` テーブル

### 3.3 Car (車両マスタ)

**実体:** ドロップダウン用の車両一覧。

| フロント側フィールド名 | 型 | API レスポンス値 |
|-------------------|-----|----------------|
| `field_2002120021` | string[] | ref 配列形式の vehicle.id |
| `field_2003520035` | string? | `carName` |
| `field_1754972826` | string | `carNumber` |
| `field_2001820018` | string? | `carBrand` |
| `field_1754977233` | string? | `remarkName` |

**出典:** [src/types/car.ts](../src/types/car.ts), [src/hook/getCars.ts](../src/hook/getCars.ts)

**取得経路:** `GET /api/v1/masters/vehicles`

**josetsu_console 対応:** `vehicles` テーブル

### 3.4 Customer (顧客マスタ)

**実体:** 顧客一覧 (現状、画面では限定的にしか使われていない)。

| フロント側フィールド名 | 型 | API レスポンス値 |
|-------------------|-----|----------------|
| `field_2001720017` | string[] | ref 配列形式の customer.id |
| `field_2002520025` | string | `address ?? ""` |
| `field_2003120031` | string | `phoneNumber ?? ""` |
| `field_1754541737` | string | `companyName` |
| `field_1754547084` | string | `representativeName ?? ""` |
| `field_1754547099` | string | `picName ?? ""` |

**出典:** [src/types/customer.ts](../src/types/customer.ts), [src/hook/getCustomer.ts](../src/hook/getCustomer.ts)

**取得経路:** `GET /api/v1/masters/customers`

**josetsu_console 対応:** `customers` テーブル (classification_id はフロントで未保持)

### 3.5 WorkPlace (作業場所マスタ)

**実体:** ドロップダウン用の作業場所一覧。

| フロント側フィールド名 | 型 | API レスポンス値 |
|-------------------|-----|----------------|
| `field_2002320023` | string[] | ref 配列形式の work_place.id |
| `field_2001920019` | string? | `workPlaceName` |
| `field_1756792186` | string[] | ref 配列形式の customer.id |
| `field_1754541737` | string? | `customer?.companyName` (ネスト解決) |
| `field_2003120031` | string? | `customer?.phoneNumber` (ネスト解決) |

**出典:** [src/types/workPlace.ts](../src/types/workPlace.ts), [src/hook/getWorkPlace.ts](../src/hook/getWorkPlace.ts)

**取得経路:** `GET /api/v1/masters/work-places`

**josetsu_console 対応:** `work_places` テーブル + `customers` の一部をフラット化

### 3.6 WorkClass (作業分類マスタ)

**実体:** 作業分類のドロップダウン (除雪/排雪/薬剤散布等)。

| フロント側フィールド名 | 型 | API レスポンス値 |
|-------------------|-----|----------------|
| `field_2000820008` | string[] | ref 配列形式の work_type.id |
| `field_2001620016` | string? | `workTypeName` |

**出典:** [src/types/workClass.ts](../src/types/workClass.ts), [src/hook/getWorkClass.ts](../src/hook/getWorkClass.ts)

**取得経路:** `GET /api/v1/masters/work-types`

**josetsu_console 対応:** `work_types` テーブル

**命名の注意:** フロントは「WorkClass」、API/DB は「work_type」。語彙が一致していない。

### 3.7 RouteGetData (路線マスタ)

**実体:** 路線選択 (運転手・車両・作業分類のデフォルトをルートから引く機能)。

| フロント側フィールド名 | 型 | 内容 |
|-------------------|-----|------|
| `field_routeId` | string[] | ref 配列形式の route.id |
| `field_workPlaceId` | string[] | 関連作業場所 ID |
| `field_workPlaceName` | string? | 作業場所名 |
| `field_workerId` | string[] | デフォルト運転手 ID |
| `field_workerName` | string? | 運転手名 |
| `field_customerId` | string[] | 顧客 ID |
| `field_companyName` | string? | 顧客会社名 |
| `field_carId` | string[] | デフォルト車両 ID |
| `field_carName` | string? | 車両名 |
| `field_workType` | string[] | 作業分類 ID |
| `field_workClassId` | string[] | 作業分類 ID **(重複)** |
| `field_workClassName` | string? | 作業分類名 |
| `field_categoryId` | string[] | 分類 (区分) ID |
| `field_categoryName` | string? | 分類 (区分) 名 |

**出典:** [src/types/reportForm.ts](../src/types/reportForm.ts), [src/hook/getRoute.ts](../src/hook/getRoute.ts)

**取得経路:** `GET /api/v1/masters/routes`

**josetsu_console 対応:** `routes` テーブル (+ `route_work_places` 中間テーブル経由の `work_places`)

**問題点:**
- `field_workType` と `field_workClassId` が**重複定義**されている。実装ミスの可能性。
- 「分類 (区分)」が `field_categoryId/Name` と表現されている。josetsu_console 側の `classifications` (`県道/市道`) に相当するはずだが命名が一致していない。

### 3.8 ReportPostData (日報 POST/PUT 用)

**実体:** フォーム入力 → API 送信前の中間構造。

| フロント側フィールド名 | 型 | 必須 | 用途 / API への変換 |
|-------------------|-----|------|-------------------|
| `field_workerId` | string[] | 必須 | → `worker_id` |
| `field_carId` | string[] | 必須 | → `car_id` |
| `field_CustomerId` | string[] | 必須 | → `customer_id` **(大文字 C 注意)** |
| `field_workClassId` | string[] | 必須 | → `work_type_id` |
| `field_workDate` | string (YYYY-MM-DD) | 必須 | → `work_date` (ISO8601 化) |
| `field_startTime` | string (HH:MM) | 必須 | → `start_at` (date+time → ISO8601) |
| `field_endTime` | string (HH:MM) | 必須 | → `end_at` (date+time → ISO8601) |
| `field_workPlaceId` | string[] | 必須 | → `work_place_id` |
| `field_weather` | string ("晴れ"等) | 必須 | → `weather_id` (inline map) |
| `field_workerName` | string | 任意 | 表示用 (送信されない可能性) |
| `field_assistantId` | string[] \| null | 任意 | → `assistant_id` |
| `field_assistantName` | string \| null | 任意 | 表示用 |
| `field_workClassName` | string \| null | 任意 | 表示用 |
| `field_carName` | string \| null | 任意 | 表示用 |
| `field_workPlaceName` | string \| null | 任意 | 表示用 |
| `field_CompanyName` | string | 必須 | 表示用 **(大文字 C 注意)** |
| `field_removalVolume` | string \| null | 任意 | → `removal_amount` |
| `field_tachometerValue?` | string | 任意 | (用途不明、API 仕様要確認) |
| `field_tachometerMemos?` | string[] | 任意 | → `tachometer_notes` |
| `field_tachometerImageUrls?` | string[] | 任意 | → `tachometer_image_url` (配列だが API は単一 URL) |

**出典:** [src/types/reportForm.ts](../src/types/reportForm.ts), [src/hook/postReportN8n.ts](../src/hook/postReportN8n.ts)

**変換ロジック (postReportN8n.ts → transformToSnakeCase):**
1. `pickId(arr)` で ref 配列の `[1]` または `[0]` を `Number` 化
2. `toIsoDateTime(date, time)` で `YYYY-MM-DD` + `HH:MM` → `YYYY-MM-DDTHH:MM+09:00`
3. `weatherMap["晴れ"]=1` などの inline マップで天気文字列を ID 化

**josetsu_console 対応:** `work_reports` テーブル (の POST 入力)

### 3.9 ReportGetData (日報 GET 用)

**実体:** API GET レスポンス → フォーム/リスト表示用に変換された日報データ。

ReportPostData とほぼ同じフィールド構成だが、`field_dayReportId` (日報自身の ID) が追加される点と、`field_totalWorkTime` (現在 `null` 固定で未実装) が含まれる点が異なる。

**変換元 (API レスポンス):**
- snake_case (`start_at`, `work_date`, `removal_amount`) と camelCase (`workerId`, `carId`) の混在
- ネストオブジェクト (`worker`, `vehicle`, `customer`, `weather` 等)

**変換後 (フロント表示):**
- すべて `field_*` 命名
- ID は ref 配列形式に再パック

**josetsu_console 対応:** `work_reports` テーブル (の GET レスポンス整形版)

### 3.10 ReportListFilters (リスト画面のフィルタ)

**実体:** クライアントサイドでの日報絞り込み。

| フィールド | 型 | 用途 |
|-----------|-----|------|
| `query` | string | 自由テキスト (場所/分類/作業員名のいずれかに前方一致) |
| `date` | string (YYYY-MM-DD) | 日付前方一致 |
| `classification` | string | 作業分類名で完全一致 |
| `location` | string | 作業場所名で完全一致 |

**出典:** [src/types/listFilters.ts](../src/types/listFilters.ts)

**josetsu_console 対応:** なし (UI 状態のみ)

### 3.11 QueuedRecord (オフライン送信待ち)

**実体:** ネットワークオフライン時に localStorage へ退避された未送信日報。

| フィールド | 型 | 用途 |
|-----------|-----|------|
| `id` | string | キュー内識別子 (UUID 想定) |
| `data` | ReportPostData | 送信予定の日報本体 |
| `metadata` | ReportN8nMetadata | n8n 経由送信のメタ情報 |
| `savedAt` | string (ISO8601) | キューイング時刻 |

**永続化キー:** `localStorage["report_offline_queue"]`

**出典:** [src/hook/useOfflineQueue.ts](../src/hook/useOfflineQueue.ts)

**制限:** 画像 (FormData) 付き日報はオフライン保存できない。

**josetsu_console 対応:** なし (クライアント側専用の機構)

## 4. 変換層の詳細

### 4.1 ID 変換 (ref 配列 ↔ INTEGER)

```typescript
// pickId: フロント形式 → API 形式
pickId(["", "123", "", "123"]) === 123
pickId("123") === 123
pickId(undefined) === null

// 逆方向: API → フロント形式
toRef = (id: number) => ["", String(id), "", String(id)]
```

### 4.2 日時変換

| 場面 | 形式 | 例 |
|------|------|----|
| フォーム入力 | `YYYY-MM-DD` + `HH:MM` (別フィールド) | `"2026-06-22"`, `"09:30"` |
| API 送信 | ISO8601 with TZ | `"2026-06-22T09:30+09:00"` |
| API レスポンス | ISO8601 | `"2026-06-22T09:30:00.000Z"` 等 |

**変換場所:** [src/hook/postReportN8n.ts](../src/hook/postReportN8n.ts) の `toIsoDate()` / `toIsoDateTime()`

### 4.3 天気のインライン ID マッピング

```typescript
// postReportN8n.ts 内に直書き
const weatherMap: Record<string, number> = {
  "晴れ": 1, "曇り": 2, "雨": 3, "雪": 4, "吹雪": 5, "みぞれ": 6,
};
```

**問題:** マスタ取得 API (`/api/v1/masters/weather` 相当) は使われていない。DB 側で weather マスタが変更されると、このハードコード値とずれる可能性がある。

## 5. josetsu_console との差分まとめ

### 5.1 フィールド命名のずれ

| エンティティ | フロント (現状) | josetsu_console | 備考 |
|------------|---------------|----------------|------|
| 日報 | `field_workDate` | `work_date` | 表現方式が違う |
| 日報 | `field_startTime` (HH:MM) | `start_at` (TIMESTAMP) | 時刻のみ vs 日時 |
| 日報 | `field_removalVolume` | `removal_amount` | 用語自体が違う (Volume vs Amount) |
| 日報 | `field_workClassId` | `work_type_id` | 「Class」vs「Type」 |
| 日報 | `field_CustomerId` | `customer_id` | 大文字 C / 小文字 c |
| 日報 | `field_CompanyName` | `customers.company_name` | 大文字 C / 小文字 c |
| 日報 | `field_tachometerImageUrls` (配列) | `tachometer_image_url` (単一) | 配列性が違う |
| 路線 | `field_categoryId` | `classification_id` | 用語自体が違う (Category vs Classification) |

### 5.2 フロントに「型として存在しない」エンティティ

josetsu_console には存在するが、SnowRemoval フロントでは独立型を持たない:

| エンティティ | 現状の扱い |
|------------|-----------|
| `weather` | 文字列でフォーム保持 → inline map で ID 化 |
| `classifications` (区分) | RouteGetData の `field_categoryId/Name` のみ。日報フォームには直接の選択肢がない |
| `contractors` (請負元) | フロント型にまったく存在しない |
| `administrators` | フロントは作業員ログインのみ。管理者ログインの実装なし |
| `unit_prices` | フロントから一切参照していない (請求金額算出はバックエンド任せ) |
| `route_work_places` | 中間テーブルは API レスポンスで畳まれた形しか見えない |
| `operation_logs` | クライアントからは送信しない (サーバ側で記録) |

### 5.3 日報の「DB にあるがフォームにない」項目

josetsu_console 側 `work_reports` には以下のカラムがあるが、SnowRemoval フォームではまだ入力できない / 入力 UI が未実装:

| カラム | 状態 |
|--------|------|
| `applied_unit_price` | サーバ側で算出されて自動セットされる想定 (フロント未管理) |
| `is_confirmed` | 事務所側 (administrator) で操作する項目。フロントには UI なし |
| `snowfall_amount` (降雪量) | フォーム未実装 |
| `service_meter_start/end` | フォーム未実装 |
| `odometer_start/end` | フォーム未実装 |
| `pre_operation_inspection` (始業点検) | フォーム未実装 (DB では NOT NULL なので**送信が落ちる可能性**) |
| `maintenance_details` / `repair_details` | フォーム未実装 |
| `refueling_station` / `gasoline_amount` / `diesel_amount` / `lubricating_oil_amount` / `hydraulic_oil_amount` | フォーム未実装 |
| `remarks` | フォーム未実装 |
| `contractor_id` | 入力 UI なし |
| `route_id` | RouteGetData の取得はあるが、フォームへの反映ロジックが弱い |

**重要:** `pre_operation_inspection` と各メーター系は josetsu_console DB 側で **NOT NULL**。現状の SnowRemoval から日報を送信すると、これらが欠落して **API エラーになる可能性**がある。

### 5.4 フロント独自の概念 (DB に無いもの)

| 概念 | 説明 |
|------|------|
| `field_*` 命名 | JustDB 由来の表記。DB 側はすべて snake_case |
| ref 配列形式の ID | JustDB の参照表現。DB は INTEGER のみ |
| オフラインキュー | クライアント永続化のみ |
| `field_workerRef` (CurrentUser) | セッション情報の一部としてフロントだけが持つ |

## 6. 主要な API エンドポイント (現状利用しているもの)

| エンドポイント | メソッド | 用途 |
|---------------|---------|------|
| `/api/v1/auth` | POST | ログイン |
| `/api/v1/auth/me` | GET | ログインユーザー取得 |
| `/api/v1/masters/workers` | GET | 作業員一覧 |
| `/api/v1/masters/vehicles` | GET | 車両一覧 |
| `/api/v1/masters/customers` | GET | 顧客一覧 |
| `/api/v1/masters/work-places` | GET | 作業場所一覧 |
| `/api/v1/masters/work-types` | GET | 作業分類一覧 |
| `/api/v1/masters/routes` | GET | 路線一覧 |
| `/api/v1/reports?all=true` | GET | 日報一覧 |
| `/api/v1/reports` | POST | 日報作成 |
| `/api/v1/reports/{id}` | PUT | 日報更新 |
| `/n8n/webhook/report-submit` | POST | n8n 経由送信 (画像対応) |

**未使用 (josetsu_console 側にはあるが SnowRemoval が呼んでいない):**
- `/api/v1/masters/weather` (相当があるなら) → 天気は inline map で対応中
- `/api/v1/masters/classifications` → 区分 UI が未実装
- `/api/v1/masters/contractors` → 請負元 UI が未実装

## 7. 移行残作業の見立て (refactor/87-use-josetsu-api ブランチ)

このリストは「現状 → josetsu_console 仕様」へのギャップそのもの。

### 7.1 高優先 (動作リスク)

1. **`pre_operation_inspection` 必須化への対応** — DB 側で NOT NULL、フロントに UI なし。現状送信すると失敗する可能性
2. **メーター系 (service_meter, odometer) の入力 UI 追加** — DB 側 NOT NULL
3. **タコメーター画像 URL の単一/配列の整合** — フロント配列、DB 単一
4. **`field_CustomerId` / `field_CompanyName` の大文字 C を統一** — 現状でも動くが事故の温床

### 7.2 中優先 (整理事項)

5. **`field_workType` と `field_workClassId` の重複** (RouteGetData) — どちらかに統一
6. **天気の inline map を排して `/api/v1/masters/weather` を使う**
7. **「区分 (classifications)」の UI 追加** — 現状路線経由のみで日報には直接ない
8. **`field_*` 命名 → `workerId` 等の素直な camelCase へ段階移行**
9. **ref 配列形式 (`["", id, "", id]`) を素の INTEGER へ**

### 7.3 低優先 (将来検討)

10. **オフラインキューを localStorage → IndexedDB へ** (画像対応のため)
11. **API レスポンスを zod 等で実行時検証**
12. **`field_totalWorkTime` の実装** (現状 null 固定)
13. **管理者ログインフローの整備** (現状作業員のみ)

## 8. 参照ファイル一覧

**型定義:**
- [src/types/worker.ts](../src/types/worker.ts)
- [src/types/car.ts](../src/types/car.ts)
- [src/types/customer.ts](../src/types/customer.ts)
- [src/types/workPlace.ts](../src/types/workPlace.ts)
- [src/types/workClass.ts](../src/types/workClass.ts)
- [src/types/reportForm.ts](../src/types/reportForm.ts) (ReportPostData / ReportGetData / RouteGetData)
- [src/types/listFilters.ts](../src/types/listFilters.ts)
- [src/types/confirmationData.ts](../src/types/confirmationData.ts)

**変換・通信:**
- [src/lib/apiClient.ts](../src/lib/apiClient.ts)
- [src/hook/postReportN8n.ts](../src/hook/postReportN8n.ts) (transformToSnakeCase, pickId, weatherMap)
- [src/hook/postReport.ts](../src/hook/postReport.ts)
- [src/hook/putReport.ts](../src/hook/putReport.ts)

**マスタ取得:**
- [src/hook/getWorkers.ts](../src/hook/getWorkers.ts)
- [src/hook/getCars.ts](../src/hook/getCars.ts)
- [src/hook/getCustomer.ts](../src/hook/getCustomer.ts)
- [src/hook/getWorkPlace.ts](../src/hook/getWorkPlace.ts)
- [src/hook/getWorkClass.ts](../src/hook/getWorkClass.ts)
- [src/hook/getRoute.ts](../src/hook/getRoute.ts)

**認証・永続化:**
- [src/hook/useLogin.ts](../src/hook/useLogin.ts)
- [src/hook/getCurrentUser.ts](../src/hook/getCurrentUser.ts)
- [src/hook/useOfflineQueue.ts](../src/hook/useOfflineQueue.ts)

**対照ドキュメント:**
- [database-specification.md](database-specification.md) (移行先 = josetsu_console 仕様)
