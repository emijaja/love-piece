import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RelationshipFormProps {
  relationship: string;
  onRelationshipChange: (value: string) => void;
  occasion: string;
  onOccasionChange: (value: string) => void;
  customMessage: string;
  onCustomMessageChange: (value: string) => void;
}

const RELATIONSHIP_OPTIONS = [
  '友人',
  '恋人',
  '兄弟',
  '両親',
  '祖父母',
  '妻、夫',
  '子供',
];

export function RelationshipForm({
  relationship,
  onRelationshipChange,
  occasion,
  onOccasionChange,
  customMessage,
  onCustomMessageChange,
}: RelationshipFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="relationship">
          相手との関係性 <span className="text-destructive">*</span>
        </Label>
        <select
          id="relationship"
          value={relationship}
          onChange={(e) => onRelationshipChange(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">選択してください</option>
          {RELATIONSHIP_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="occasion">メッセージの場面</Label>
        <Input
          id="occasion"
          placeholder="例: 誕生日、記念日、感謝、お祝い"
          value={occasion}
          onChange={(e) => onOccasionChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customMessage">特に伝えたいこと</Label>
        <Input
          id="customMessage"
          placeholder="例: いつも支えてくれてありがとう"
          value={customMessage}
          onChange={(e) => onCustomMessageChange(e.target.value)}
        />
      </div>
    </div>
  );
}
