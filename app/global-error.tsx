'use client';

import { NexusButton } from '@/app/components/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-gray-600 mb-6">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            <NexusButton
              onClick={() => reset()}
              variant="primary"
            >
              再試行
            </NexusButton>
          </div>
        </div>
      </body>
    </html>
  );
} 