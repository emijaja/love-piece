'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GeneratedTextDisplay } from '@/components/generated-text-display';
import { LoadingSpinner } from '@/components/loading-spinner';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-10 h-10 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold">メッセージが完成しました</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            大切な人へのメッセージをお送りください
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 再生成中はローディング表示 */}
        {isGenerating ? (
          <Card>
            <CardContent className="pt-6">
              <LoadingSpinner message="メッセージを再生成しています..." />
            </CardContent>
          </Card>
        ) : (
          <GeneratedTextDisplay
            text={generatedText || ''}
            tone={selectedTone}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            isRegenerating={isGenerating}
            isCopied={isCopied}
          />
        )}

        {/* ナビゲーションボタン */}
        <div className="flex gap-4">
          <Button onClick={handleBack} className="flex-1" variant="outline" size="lg">
            入力画面に戻る
          </Button>
          <Button onClick={handleNewGeneration} className="flex-1" size="lg">
            新しくつくる
          </Button>
        </div>
      </div>
    </div>
  );
}
