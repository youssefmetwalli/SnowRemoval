import React, { useEffect, useRef } from "react";
import { CameraIcon, GaugeIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export interface TachometerPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

interface Props {
  tachometerValue: string;
  onTachometerChange: (value: string) => void;
  photos: TachometerPhoto[];
  onPhotosChange: (photos: TachometerPhoto[]) => void;
  memos: string[];
  onMemosChange: (memos: string[]) => void;
}

export const TachometerSection = ({
  tachometerValue,
  onTachometerChange,
  photos,
  onPhotosChange,
  memos,
  onMemosChange,
}: Props): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const newPhotos: TachometerPhoto[] = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    onPhotosChange([...photos, ...newPhotos]);
    event.target.value = "";
  };

  const handleRemovePhoto = (photoId: string) => {
    const target = photos.find((photo) => photo.id === photoId);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onPhotosChange(photos.filter((photo) => photo.id !== photoId));
  };

  const handleAddMemo = () => {
    onMemosChange([...memos, ""]);
  };

  const handleMemoChange = (index: number, value: string) => {
    const updated = [...memos];
    updated[index] = value;
    onMemosChange(updated);
  };

  const handleRemoveMemo = (index: number) => {
    onMemosChange(memos.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  return (
    <Card className="w-full bg-white rounded-xl border border-slate-200 shadow-[0px_1px_3px_#0000001a]">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <GaugeIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">タコメーター</h2>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-slate-600">
            走行距離 / メーター値
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="例: 125430"
            value={tachometerValue}
            onChange={(e) => onTachometerChange(e.target.value)}
            className="h-10 text-sm border-slate-200 focus:border-blue-300 focus:ring-blue-100"
          />
        </div>

        <div className="border-t border-slate-100" />

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-600">
            タコメーター写真
          </Label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            onClick={handleOpenCamera}
            className="w-full h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-300 rounded-lg text-sm font-medium shadow-none"
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            カメラを起動
          </Button>

          <p className="text-xs text-slate-400">
            スマートフォンではカメラが起動し、撮影した写真がプレビュー表示されます。
          </p>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                >
                  <img
                    src={photo.previewUrl}
                    alt="タコメーター写真プレビュー"
                    className="w-full h-32 object-cover"
                  />
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-slate-500 truncate">
                      {photo.file.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-slate-200 transition-colors"
                    aria-label="写真を削除"
                  >
                    <Trash2Icon className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100" />
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-600">メモ</Label>

          {memos.length === 0 && (
            <p className="text-xs text-slate-400">
              メモはまだありません。ボタンを押して追加してください。
            </p>
          )}

          <div className="space-y-2">
            {memos.map((memo, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-5 text-right shrink-0">
                  {index + 1}
                </span>
                <Input
                  type="text"
                  placeholder={`メモを入力...`}
                  value={memo}
                  onChange={(e) => handleMemoChange(index, e.target.value)}
                  className="h-10 flex-1 text-sm border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMemo(index)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-red-50 transition-colors shrink-0"
                  aria-label="メモを削除"
                >
                  <Trash2Icon className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleAddMemo}
            className="w-full h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-300 rounded-lg text-sm font-medium shadow-none"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            メモを追加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
