① Gemini（Google） — 最もMVP向き
API形式

REST API（HTTP）です。
つまり 普通のfetchで呼べる。SDKもあるけど不要。

画像の送り方

2通りあります。

A. Base64で直接送る（MVP向き）
{
  contents: [{
    parts: [
      { text: "この写真の出来事を説明して" },
      {
        inline_data: {
          mime_type: "image/jpeg",
          data: "base64文字列"
        }
      }
    ]
  }]
}


→ つまり
フロントでアップロード → サーバでbase64化 → APIへ
でOK。

B. URLで送る

Google Cloud Storage に置いた画像URLを指定して送る方法もあります。

特徴

複数画像を一度に送れる（これがこのアプリと相性抜群）

日本語がかなり自然

無料枠がある（MVP最大の利点）

向いている役割

👉 「写真アルバム → 思い出ストーリー生成」

このアプリの中核用途に一番合ってます。