import { Button } from '@/components/ui/button';

type ToneType = 'casual' | 'formal' | 'poetic';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
}

const TONE_OPTIONS = [
  {
    value: 'casual' as const,
    label: 'カジュアル',
    description: '親しみやすく温かいトーン',
  },
  {
    value: 'formal' as const,
    label: 'フォーマル',
    description: '丁寧で礼儀正しいトーン',
  },
  {
    value: 'poetic' as const,
    label: '詩的',
    description: '感情豊かで美しいトーン',
  },
] as const;

export function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {TONE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={selectedTone === option.value ? 'default' : 'outline'}
            onClick={() => onToneChange(option.value)}
            className="flex-1"
            aria-label={`${option.label}を選択`}
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold">{option.label}</span>
              <span className="text-xs opacity-80">{option.description}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
