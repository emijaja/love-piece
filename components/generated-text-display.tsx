import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ToneType = 'casual' | 'formal' | 'poetic';

interface GeneratedTextDisplayProps {
  text: string;
  tone: ToneType;
  onCopy: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  isCopied: boolean;
}

const TONE_LABELS: Record<ToneType, string> = {
  casual: 'カジュアル',
  formal: 'フォーマル',
  poetic: '詩的',
};

export function GeneratedTextDisplay({
  text,
  tone,
  onCopy,
  onRegenerate,
  isRegenerating,
  isCopied,
}: GeneratedTextDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>生成されたメッセージ</CardTitle>
          <Badge>{TONE_LABELS[tone]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-6">
          <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onCopy} aria-label="メッセージをコピー">
          {isCopied ? (
            <>
              <Check className="w-4 h-4 mr-2" aria-hidden="true" />
              コピーしました
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
              コピー
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={isRegenerating}
          aria-label="メッセージを再生成"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {isRegenerating ? '再生成中...' : '再生成'}
        </Button>
      </CardFooter>
    </Card>
  );
}
