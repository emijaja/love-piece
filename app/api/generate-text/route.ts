import { NextRequest, NextResponse } from 'next/server';

// トーンタイプの定義
type ToneType = 'casual' | 'formal' | 'poetic';

// リクエストボディの型定義
interface GenerateTextRequest {
  imageData: string[];  // Base64エンコードされた画像データの配列（data:image/jpeg;base64,... 形式）
  tone: ToneType;
}

// Gemini APIのレスポンス型定義
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// トーン別のプロンプトテンプレート
const TONE_PROMPTS: Record<ToneType, string> = {
  casual: `これらの写真に写っている人への感謝の気持ちを、親しみやすく温かいトーンで文章にしてください。

要件:
- カジュアルで親しみやすい表現を使う
- 「いつもありがとう」「一緒にいてくれて嬉しい」など、身近な言葉を使う
- 3〜5文程度の長さ
- 写真から読み取れる状況や雰囲気を踏まえる
- 複数の写真がある場合は、それぞれの思い出を織り交ぜる
- 感謝の気持ちが伝わるように`,

  formal: `これらの写真に写っている人への感謝の気持ちを、丁寧でフォーマルなトーンで文章にしてください。

要件:
- 丁寧で礼儀正しい表現を使う
- 「お世話になっております」「心より感謝申し上げます」など、フォーマルな言葉を使う
- 3〜5文程度の長さ
- 写真から読み取れる状況や雰囲気を踏まえる
- 複数の写真がある場合は、それぞれの思い出を織り交ぜる
- 敬意と感謝の気持ちが伝わるように`,

  poetic: `これらの写真に写っている人への感謝の気持ちを、詩的で感情豊かなトーンで文章にしてください。

要件:
- 詩的で美しい表現を使う
- 比喩や情景描写を織り交ぜる
- 3〜5文程度の長さ
- 写真から読み取れる状況や雰囲気を踏まえる
- 複数の写真がある場合は、それぞれの思い出を織り交ぜる
- 深い感謝と愛情が伝わるように`
};

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body: GenerateTextRequest = await request.json();
    const { imageData, tone } = body;

    // バリデーション
    if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
      return NextResponse.json(
        { error: '画像データが提供されていません' },
        { status: 400 }
      );
    }

    if (!tone || !['casual', 'formal', 'poetic'].includes(tone)) {
      return NextResponse.json(
        { error: '無効なトーンが指定されています' },
        { status: 400 }
      );
    }

    // 環境変数の確認
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY が設定されていません');
      return NextResponse.json(
        { error: 'APIキーが設定されていません' },
        { status: 500 }
      );
    }

    // 複数の画像をpartsに変換
    const imageParts = imageData.map(image => {
      // Base64データからMIMEタイプとデータ部分を抽出
      // imageは "data:image/jpeg;base64,/9j/4AAQ..." の形式
      const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        throw new Error('無効な画像データ形式です');
      }

      const mimeType = `image/${matches[1]}`;
      const base64Data = matches[2];

      return {
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      };
    });

    // Gemini API へのリクエスト
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRequestBody = {
      contents: [
        {
          parts: [
            { text: TONE_PROMPTS[tone] },
            ...imageParts,
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API エラー:', errorText);
      return NextResponse.json(
        { error: 'AI による文章生成に失敗しました' },
        { status: response.status }
      );
    }

    const data: GeminiResponse = await response.json();

    // レスポンスから生成されたテキストを抽出
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('Gemini API レスポンスにテキストが含まれていません:', data);
      return NextResponse.json(
        { error: '文章の生成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: generatedText,
      tone,
    });

  } catch (error) {
    console.error('文章生成エラー:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました'
      },
      { status: 500 }
    );
  }
}
