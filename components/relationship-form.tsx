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
        <Input
          id="relationship"
          placeholder="例: 恋人、友人、家族、同僚"
          value={relationship}
          onChange={(e) => onRelationshipChange(e.target.value)}
          required
        />
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
