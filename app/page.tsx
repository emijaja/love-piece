'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ImageUploadZone } from '@/components/image-upload-zone';
import { ToneSelector } from '@/components/tone-selector';
import { RelationshipForm } from '@/components/relationship-form';
import { LoadingSpinner } from '@/components/loading-spinner';
import { getFormData, setFormData, setGeneratedText } from '@/lib/session-storage';

type ToneType = 'casual' | 'formal' | 'poetic';

export default function Home() {
  const router = useRouter();

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
  const [error, setError] = useState<string | null>(null);

  // マウント時: sessionStorageから前回データを復元
  useEffect(() => {
    const savedData = getFormData();
    if (savedData) {
      if (savedData.selectedImage) setSelectedImage(savedData.selectedImage);
      if (savedData.relationship) setRelationship(savedData.relationship);
      if (savedData.occasion) setOccasion(savedData.occasion);
      if (savedData.customMessage) setCustomMessage(savedData.customMessage);
      if (savedData.selectedTone) setSelectedTone(savedData.selectedTone);
    }
  }, []);

  // バリデーション
  const isFormValid = () => {
    return selectedImage !== null && relationship.trim() !== '';
  };

  // 画像選択時: sessionStorageに保存
  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
    setFormData({ selectedImage: image });
  };

  // 画像リセット
  const handleImageReset = () => {
    setSelectedImage(null);
    setFormData({ selectedImage: null });
    setError(null);
  };

  // トーン選択時: sessionStorageに保存
  const handleToneChange = (tone: ToneType) => {
    setSelectedTone(tone);
    setFormData({ selectedTone: tone });
  };

  // フォーム入力時: sessionStorageに保存
  const handleRelationshipChange = (value: string) => {
    setRelationship(value);
    setFormData({ relationship: value });
  };

  const handleOccasionChange = (value: string) => {
    setOccasion(value);
    setFormData({ occasion: value });
  };

  const handleCustomMessageChange = (value: string) => {
    setCustomMessage(value);
    setFormData({ customMessage: value });
  };

  // 生成リクエスト
  const handleGenerate = async () => {
    if (!isFormValid()) {
      setError('画像と相手との関係性を入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage,
          tone: selectedTone,
          relationship,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '文章の生成に失敗しました');
      }

      const data = await response.json();

      // sessionStorageに保存
      setGeneratedText(data.text);

      // /arigato に遷移
      router.push('/arigato');
    } catch (err) {
      console.error('生成エラー:', err);
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold">感謝を伝える</h1>
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
                    onImageSelect={handleImageSelect}
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
                  <ToneSelector selectedTone={selectedTone} onToneChange={handleToneChange} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>メッセージの内容</CardTitle>
                </CardHeader>
                <CardContent>
                  <RelationshipForm
                    relationship={relationship}
                    onRelationshipChange={handleRelationshipChange}
                    occasion={occasion}
                    onOccasionChange={handleOccasionChange}
                    customMessage={customMessage}
                    onCustomMessageChange={handleCustomMessageChange}
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
      </div>
    </div>
  );
}
