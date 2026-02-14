import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = '読み込み中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader className="w-12 h-12 animate-spin text-primary" aria-hidden="true" />
      <p className="text-lg font-medium text-center">{message}</p>
    </div>
  );
}
