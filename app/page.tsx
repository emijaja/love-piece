"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// サンプル画像のURL
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'casual' | 'formal' | 'poetic'>('casual');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleGenerateText = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      // 画像データを sessionStorage に保存
      sessionStorage.setItem("uploadedImage", selectedImage);
      sessionStorage.setItem("selectedTone", selectedTone);

      // API Route を呼び出し
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
      const generatedText = data.text;

      // 生成された文章を sessionStorage に保存
      sessionStorage.setItem("generatedText", generatedText);

      // 結果ページに遷移
      router.push("/result");
    } catch (err) {
      console.error('文章生成エラー:', err);
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            写真から文章を作成
          </h1>
          <p className="text-lg text-gray-600">
            写真をアップロードして、AI が文章を自動生成します
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* 画像アップロードエリア */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              写真を選択
            </h2>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {selectedImage ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={selectedImage}
                      alt="選択された画像"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-20 h-20 mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-xl text-gray-700">
                      <span className="font-semibold">クリックして画像を選択</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF (最大 10MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            {selectedImage && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                画像を変更
              </button>
            )}

            {/* サンプル画像選択 */}
            {!selectedImage && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <p className="text-sm text-gray-500">または</p>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  サンプル画像を選択
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {SAMPLE_IMAGES.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSampleImage(imageUrl)}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300 hover:border-indigo-500 transition-colors"
                    >
                      <img
                        src={imageUrl}
                        alt={`サンプル画像 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* トーン選択 */}
            {selectedImage && (
              <div className="space-y-4 mt-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                  文章のトーンを選択
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedTone('casual')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTone === 'casual'
                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-indigo-400'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-lg mb-1">カジュアル</div>
                      <div className="text-sm text-gray-600">
                        親しみやすく温かい表現
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedTone('formal')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTone === 'formal'
                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-indigo-400'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-lg mb-1">フォーマル</div>
                      <div className="text-sm text-gray-600">
                        丁寧で礼儀正しい表現
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedTone('poetic')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTone === 'poetic'
                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-indigo-400'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-lg mb-1">詩的</div>
                      <div className="text-sm text-gray-600">
                        感情豊かで美しい表現
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold">エラー: {error}</span>
              </div>
            </div>
          )}

          {/* 生成ボタン */}
          {selectedImage && (
            <button
              onClick={handleGenerateText}
              disabled={isGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  生成中...
                </span>
              ) : (
                "文章を生成する"
              )}
            </button>
          )}
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>AI が写真を分析して、感謝の文章を自動生成します</p>
        </div>
      </div>
    </div>
  );
}
