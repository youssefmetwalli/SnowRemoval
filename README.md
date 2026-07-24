# SnowRemoval

現場作業員向けの除雪日報 PWA。React 18 + Vite + React Router で構築され、Vercel 上でホストされる。バックエンドは同社が別途運用する `josetsu_console` (Nuxt 3 + PostgreSQL + n8n + Cloudflare R2、VPS 上) に接続する。

## アーキテクチャ

```
[作業員のスマホ (PWA)]
        │
        ▼
[SnowRemoval (Vercel)]
        │  /api/v1/*   ─→ josetsu_console (JWT Cookie 認証、日報 CRUD、マスタ)
        │  /n8n/*      ─→ n8n webhook (日報送信 + 画像アップロード → R2)
        ▼
[VPS: nginx → josetsu_console / n8n / PostgreSQL]
                                                    │
                                                    ▼
                                       [Cloudflare R2] (画像保管)
```

## 開発

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run test       # vitest
npm run build
```

### 前提サービス

- `josetsu_console` を localhost:3000 で起動 (もしくは vite.config.ts の proxy 先を変更)
- n8n を localhost:5678 で起動
- 詳細な JWT 認証仕様: `josetsu_console/docs/other/SnowRemoval統合アーキテクチャ.md`

### 環境変数

`.env.example` を `.env.local` にコピーして必要な値を設定する。

## テスト

- **フレームワーク**: Vitest 2.x + `@testing-library/react` + MSW 2.x
- **場所**: `src/**/*.{test,spec}.{ts,tsx}`
- **CI**: `.github/workflows/ci.yml` で push/PR ごとに `typecheck` + `test` + `build`

```bash
npm run test          # 一回実行
npm run test:watch    # ウォッチ
```

## PWA

`vite-plugin-pwa` により Service Worker と `manifest.webmanifest` が自動生成される。

- 開発中の SW は無効 (`devOptions.enabled: false`)
- `/api/v1/*` は NetworkFirst (5s timeout)
- `/n8n/*` は NetworkOnly (webhook をキャッシュしない)
- インストール導線は `src/components/InstallPrompt.tsx` (Android/PC は `beforeinstallprompt`、iOS Safari は手順案内)

アイコンは `static/icons/` に配置。デザイン確定版に差し替える場合は同サイズ (192 / 512 / apple-touch 180) を差し替えるだけでよい。

## n8n workflow の VPS 投入手順

日報送信は `POST /n8n/webhook/report-submit` で受け取り、以下を行う workflow を n8n 側に import しておく必要がある。

1. VPS に SSH し、n8n UI (`http://localhost:5678`) を開く (SSH ポートフォワード推奨)
2. **Workflows → Import from File** から `josetsu_console/n8n/register_daily_report_workflow.json` を import
3. Webhook node の `webhookId` が `ebed23e7-6411-42a1-bb4a-a71fe48a2748` であること (SnowRemoval 側と一致) を確認
4. 対応する PostgreSQL / R2 のクレデンシャル (Credential) を割り当てる
5. 右上の **Active** を ON にする
6. 疎通確認:

    ```bash
    curl -X POST http://localhost:5678/webhook/report-submit \
      -H 'Content-Type: application/json' \
      -d '{"worker_id":1,"car_id":1,"work_date":"2026-07-24T00:00+09:00"}'
    ```

    200 応答であれば OK。

### 送信ペイロード

- `Content-Type: multipart/form-data`
  - `report`: JSON 文字列 (snake_case、`transformToSnakeCase` の出力)
  - `tachometer_value`: 文字列 (任意)
  - `tachometer_notes`: JSON 配列文字列 (任意)
  - `images`: 画像ファイル (0..N 枚、フロント側で最大長辺 1600px / JPEG quality 0.85 にリサイズ済み)
- 画像が無くタコメータメモも無い場合は JSON 単発 (`application/json`)

### リトライ

`postReportN8n` は 5xx 応答に対し **最大 3 回、指数バックオフ (500ms / 1s / 2s)** で自動リトライする。4xx (バリデーションエラー等) はリトライせず即エラー。オフライン時は `useOfflineQueue` に保存し、`online` イベントで自動再送信する。

## ホスティング

- **本番**: `snow-removal-eight.vercel.app` (Vercel、author 縛り `takehiroFukaya`)
- **プレビュー**: 各 PR の Vercel Preview URL
- Vercel の `vercel.json` で `/api/v1/*` と `/n8n/*` を VPS 経由 (現状は Cloudflare Quick Tunnel、正式ドメイン移行予定) に rewrite
