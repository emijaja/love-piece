'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/loading-spinner';
import { LetterLayout } from '@/components/letter-layout';
import {
  getFormData,
  getGeneratedText,
  setGeneratedText,
  clearSessionData,
} from '@/lib/session-storage';

type ToneType = 'casual' | 'formal' | 'poetic';

export default function ArigatoPage() {
  const router = useRouter();
  const [generatedText, setLocalGeneratedText] = useState<string | null>(null);
  const [selectedTone, setLocalTone] = useState<ToneType>('casual');
  const [selectedImage, setLocalImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // マウント時: sessionStorageからデータを読み込み
  useEffect(() => {
    const formData = getFormData();
    const text = getGeneratedText();

    if (!formData || !text) {
      // データがない場合は入力画面に戻す
      router.push('/');
      return;
    }

    setLocalImage(formData.selectedImage);
    setLocalTone(formData.selectedTone);
    setLocalGeneratedText(text);
    setIsLoading(false);
  }, [router]);

  // 再生成
  const handleRegenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);
    setIsCopied(false);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: selectedImage,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '文章の生成に失敗しました');
      }

      const data = await response.json();
      setLocalGeneratedText(data.text);

      // sessionStorageを更新
      setGeneratedText(data.text);
    } catch (err) {
      console.error('再生成エラー:', err);
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // コピー
  const handleCopy = async () => {
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗:', err);
      setError('クリップボードへのコピーに失敗しました');
    }
  };

  // 戻る
  const handleBack = () => {
    router.push('/');
  };

  // 新規作成
  const handleNewGeneration = () => {
    clearSessionData();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <LoadingSpinner message="データを読み込んでいます..." />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* エラー表示 */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive">
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* 再生成中はローディング表示 */}
      {isGenerating ? (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <LoadingSpinner message="メッセージを再生成しています..." />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <LetterLayout
          image={selectedImage}
          text={generatedText || ''}
          tone={selectedTone}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
          isRegenerating={isGenerating}
          isCopied={isCopied}
        />
      )}

      {/* ナビゲーションボタン */}
      {!isGenerating && (
        <div className="px-4">
          <div className="flex justify-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <Button onClick={handleBack} variant="outline" size="lg">
              入力画面に戻る
            </Button>
            <Button onClick={handleNewGeneration} size="lg">
              新しくつくる
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
