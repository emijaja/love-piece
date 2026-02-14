'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ImageUploadZone } from '@/components/image-upload-zone';
import { ToneSelector } from '@/components/tone-selector';
import { RelationshipForm } from '@/components/relationship-form';
import { GeneratedTextDisplay } from '@/components/generated-text-display';
import { LoadingSpinner } from '@/components/loading-spinner';

type ToneType = 'casual' | 'formal' | 'poetic';

export default function Home() {
  // 画面状態
  const [screenState, setScreenState] = useState<'input' | 'result'>('input');

  // 画像関連
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // フォーム入力
  const [relationship, setRelationship] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');

  // トーン選択
  const [selectedTone, setSelectedTone] = useState<ToneType>('casual');

  // API状態
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // コピー状態
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // バリデーション
  const isFormValid = () => {
    return selectedImage !== null && relationship.trim() !== '';
  };

  // 画像リセット
  const handleImageReset = () => {
    setSelectedImage(null);
    setError(null);
  };

  // 生成リクエスト
  const handleGenerate = async () => {
    if (!isFormValid()) {
      setError('画像と相手との関係性を入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedText(null);
    setIsCopied(false);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setGeneratedText(data.text);
      setScreenState('result');
    } catch (err) {
      console.error('生成エラー:', err);
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 再生成
  const handleRegenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);
    setIsCopied(false);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // 入力画面に戻る
  const handleBack = () => {
    setScreenState('input');
    setError(null);
    setIsCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-10 h-10 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold">Love Piece</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            大切な人へのメッセージを、AIがお手伝いします
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 入力+待機画面 */}
        {screenState === 'input' && (
          <div className="space-y-6">
            {/* 生成中はローディング表示 */}
            {isGenerating ? (
              <Card>
                <CardContent className="pt-6">
                  <LoadingSpinner message="AIが画像を分析してメッセージを生成しています..." />
                </CardContent>
              </Card>
            ) : (
              <>
                {/* 入力フォーム */}
                <Card>
                  <CardHeader>
                    <CardTitle>写真をアップロード</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUploadZone
                      onImageSelect={setSelectedImage}
                      currentImage={selectedImage}
                      onReset={handleImageReset}
                      onError={setError}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>メッセージのトーン</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ToneSelector selectedTone={selectedTone} onToneChange={setSelectedTone} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>メッセージの内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RelationshipForm
                      relationship={relationship}
                      onRelationshipChange={setRelationship}
                      occasion={occasion}
                      onOccasionChange={setOccasion}
                      customMessage={customMessage}
                      onCustomMessageChange={setCustomMessage}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleGenerate}
                      disabled={!isFormValid() || isGenerating}
                      className="w-full"
                      size="lg"
                      aria-label="メッセージを生成"
                    >
                      メッセージを生成
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        )}

        {/* 結果画面 */}
        {screenState === 'result' && generatedText && (
          <div className="space-y-6">
            {/* 再生成中はローディング表示 */}
            {isGenerating ? (
              <Card>
                <CardContent className="pt-6">
                  <LoadingSpinner message="メッセージを再生成しています..." />
                </CardContent>
              </Card>
            ) : (
              <GeneratedTextDisplay
                text={generatedText}
                tone={selectedTone}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
                isRegenerating={isGenerating}
                isCopied={isCopied}
              />
            )}
            <Button onClick={handleBack} className="w-full" variant="outline" size="lg">
              入力画面に戻る
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
