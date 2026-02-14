'use client';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Copy, Check, RefreshCw } from 'lucide-react';

type ToneType = 'casual' | 'formal' | 'poetic';

interface LetterLayoutProps {
  images: string[];
  text: string;
  tone: ToneType;
  onCopy: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  isCopied: boolean;
}

const TONE_BACKGROUNDS: Record<ToneType, string> = {
  casual: 'bg-gradient-to-br from-orange-50 to-amber-50',
  formal: 'bg-gradient-to-br from-slate-50 to-gray-50',
  poetic: 'bg-gradient-to-br from-purple-50 to-pink-50',
};

export function LetterLayout({
  images,
  text,
  tone,
  onCopy,
  onRegenerate,
  isRegenerating,
  isCopied,
}: LetterLayoutProps) {
  const bgClass = TONE_BACKGROUNDS[tone];

  return (
    <div className={`min-h-screen py-16 px-4 ${bgClass}`}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 画像（存在する場合のみ） */}
          {images.length > 0 && (
            <div className="w-full">
              {images.length === 1 ? (
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={images[0]}
                    alt="思い出の写真"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-4">
                  {images.map((image, index) => (
                    <AspectRatio key={index} ratio={4 / 3}>
                      <img
                        src={image}
                        alt={`思い出の写真 ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </AspectRatio>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* テキスト */}
          <div className="px-8 md:px-12 py-8">
            <p className="leading-loose text-lg text-gray-800 whitespace-pre-wrap font-serif">
              {text}
            </p>
          </div>

          {/* ボタン */}
          <div className="border-t border-gray-100 px-8 md:px-12 py-6 bg-gray-50/30">
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={onCopy}>
                {isCopied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {isCopied ? 'コピーしました' : 'コピー'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                disabled={isRegenerating}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`}
                />
                再生成
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
