"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// デフォルトのダミー画像とテキスト
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop";
const DEFAULT_TEXT = "この画像からは、美しい風景が感じられます。空の青さと緑の豊かさが調和し、穏やかな雰囲気を醸し出しています。自然の美しさが心を癒してくれる、そんな一枚です。";

export default function ResultPage() {
  const [uploadedImage, setUploadedImage] = useState<string>(DEFAULT_IMAGE);
  const [generatedText, setGeneratedText] = useState<string>(DEFAULT_TEXT);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentTone, setCurrentTone] = useState<'casual' | 'formal' | 'poetic'>('casual');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // sessionStorage から画像と文章を取得
    const image = sessionStorage.getItem("uploadedImage");
    const text = sessionStorage.getItem("generatedText");
    const tone = sessionStorage.getItem("selectedTone") as 'casual' | 'formal' | 'poetic' | null;

    if (image && text) {
      // データがある場合は sessionStorage のデータを使用
      setUploadedImage(image);
      setGeneratedText(text);
      if (tone) {
        setCurrentTone(tone);
      }
    }
    // データがない場合はデフォルト値（DEFAULT_IMAGE, DEFAULT_TEXT）を使用
  }, []);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert("文章をコピーしました");
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: uploadedImage,
          tone: currentTone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '文章の生成に失敗しました');
      }

      const data = await response.json();
      const regeneratedText = data.text;

      setGeneratedText(regeneratedText);
      sessionStorage.setItem("generatedText", regeneratedText);
    } catch (err) {
      console.error('文章再生成エラー:', err);
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleBackToUpload = () => {
    // sessionStorage をクリア
    sessionStorage.removeItem("uploadedImage");
    sessionStorage.removeItem("generatedText");
    sessionStorage.removeItem("selectedTone");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            生成された文章
          </h1>
          <p className="text-lg text-gray-600">
            画像から自動生成された文章です
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 画像表示エリア */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              アップロードした写真
            </h2>
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={uploadedImage}
                alt="アップロードされた画像"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 文章表示エリア */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              生成された文章
            </h2>
            <div className="text-sm text-gray-600 mb-4">
              トーン: {
                currentTone === 'casual' ? 'カジュアル' :
                currentTone === 'formal' ? 'フォーマル' : '詩的'
              }
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 min-h-[300px] flex items-center">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {generatedText}
              </p>
            </div>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
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

        {/* アクションボタン */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleCopyText}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              文章をコピー
            </button>

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  再生成中...
                </>
              ) : (
                <>
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  文章を再生成
                </>
              )}
            </button>

            <button
              onClick={handleBackToUpload}
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors border-2 border-gray-300 flex items-center justify-center gap-2"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              新しい画像をアップロード
            </button>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>AI が生成した文章です。必要に応じて編集してご利用ください</p>
        </div>
      </div>
    </div>
  );
}
