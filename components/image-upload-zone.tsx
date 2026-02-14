'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageUploadZoneProps {
  onImageSelect: (imageData: string) => void;
  currentImages: string[];
  onRemoveImage: (index: number) => void;
  onError: (error: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ImageUploadZone({
  onImageSelect,
  currentImages,
  onRemoveImage,
  onError,
}: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndConvertImage = (file: File) => {
    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      onError('ファイルサイズは10MB以下にしてください');
      return;
    }

    // 画像タイプチェック
    if (!file.type.startsWith('image/')) {
      onError('画像ファイルを選択してください');
      return;
    }

    // Base64変換
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.onerror = () => {
      onError('画像の読み込みに失敗しました');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        validateAndConvertImage(file);
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(file => {
        validateAndConvertImage(file);
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative">
              <AspectRatio ratio={1}>
                <img
                  src={image}
                  alt={`選択された画像 ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </AspectRatio>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onRemoveImage(index)}
                aria-label={`画像 ${index + 1} を削除`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12
          flex flex-col items-center justify-center
          cursor-pointer transition-colors
          ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <Upload className="w-12 h-12 text-muted-foreground mb-4" aria-hidden="true" />
        <p className="text-lg font-medium mb-2">
          {currentImages.length > 0 ? '画像を追加' : '画像をアップロード'}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          クリックして選択、またはドラッグ&ドロップ
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          最大10MB（JPG、PNG、GIFなど）・複数選択可
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="画像ファイルを選択"
      />
    </div>
  );
}
