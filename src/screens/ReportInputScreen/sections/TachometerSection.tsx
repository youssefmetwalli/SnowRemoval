import React, { useEffect, useRef } from "react";
import { CameraIcon, GaugeIcon, Trash2Icon } from "lucide-react";
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
}

export const TachometerSection = ({
  tachometerValue,
  onTachometerChange,
  photos,
  onPhotosChange,
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

    // 同じファイルを再度選択できるようにリセット
    event.target.value = "";
  };

  const handleRemovePhoto = (photoId: string) => {
    const target = photos.find((photo) => photo.id === photoId);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }

    onPhotosChange(photos.filter((photo) => photo.id !== photoId));
  };

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
          <h2 className="text-lg font-semibold text-gray-500">タコメーター</h2>
        </div>

        <div className="space-y-2">
          <Label className="text-lg">走行距離 / メーター値</Label>
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="例: 125430"
            value={tachometerValue}
            onChange={(e) => onTachometerChange(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lg">タコメーター写真</Label>

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
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px]"
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            カメラを起動
          </Button>

          <p className="text-sm text-slate-500">
            スマートフォンではカメラが起動し、撮影した写真が下にプレビュー表示されます。
          </p>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={photo.previewUrl}
                    alt="タコメーター写真プレビュー"
                    className="w-full h-36 object-cover"
                  />

                  <div className="p-2">
                    <p className="text-xs text-slate-600 truncate">
                      {photo.file.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    aria-label="写真を削除"
                  >
                    <Trash2Icon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
