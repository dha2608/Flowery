'use client';

import { Container } from '@/components/layout';

export default function OfflinePage() {
  return (
    <Container className="py-20">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="mb-6 text-6xl">🌸</span>
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Bạn đang offline
        </h1>
        <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
          Vui lòng kiểm tra kết nối internet và thử lại. Một số tính năng có thể không hoạt động khi
          offline.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-medium text-white transition-colors"
        >
          Thử lại
        </button>
      </div>
    </Container>
  );
}
