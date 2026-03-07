'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Users, Calendar, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout';
import { Avatar, Button, Spinner } from '@/components/ui';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useRelationships, type RelationshipType } from '@/hooks/use-relationships';
import { formatDate, cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

type FilterType = RelationshipType | '';

const TYPE_LABELS: Record<RelationshipType, string> = {
  family: 'Gia đình',
  friend: 'Bạn bè',
  lover: 'Người yêu',
  colleague: 'Đồng nghiệp',
  other: 'Khác',
};

const FILTER_TABS: { value: FilterType; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'family', label: 'Gia đình' },
  { value: 'friend', label: 'Bạn bè' },
  { value: 'lover', label: 'Người yêu' },
  { value: 'colleague', label: 'Đồng nghiệp' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RelationshipsPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('');
  const { data, isLoading } = useRelationships({ type: filter });
  const relationships = data?.relationships ?? [];

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg font-serif">Mối quan hệ</h1>
          <p className="body-base text-stone-500 mt-1">Quản lý người thân, bạn bè và những người quan trọng</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => router.push('/relationships/new')}
          className="shrink-0"
        >
          Thêm mới
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === tab.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" label="Đang tải…" />
        </div>
      ) : relationships.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <Users className="h-10 w-10 text-primary-400" />
          </div>
          <h2 className="heading-sm font-serif">
            {filter ? 'Không có mối quan hệ nào' : 'Chưa có mối quan hệ nào'}
          </h2>
          <p className="body-base text-stone-500 mt-2 mb-6 max-w-sm mx-auto">
            Thêm mối quan hệ đầu tiên để nhận gợi ý hoa phù hợp cho từng người thân yêu
          </p>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => router.push('/relationships/new')}
          >
            Thêm mối quan hệ
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relationships.map((rel) => (
            <Link key={rel._id} href={`/relationships/${rel._id}`} className="group block">
              <div className="card-base card-hover h-full transition-all">
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={rel.name} size="lg" className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-stone-900 truncate leading-tight">
                          {rel.name}
                        </h3>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-400" />
                      </div>
                      <div className="mt-1.5">
                        <span className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs font-medium">
                          {TYPE_LABELS[rel.type]}
                        </span>
                      </div>
                      {rel.birthday && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-stone-400">
                          <Calendar className="h-3.5 w-3.5" />
                          Sinh nhật: {formatDate(rel.birthday)}
                        </p>
                      )}
                      {rel.importantDates && rel.importantDates.length > 0 && (
                        <p className="mt-1 text-xs text-stone-400">
                          {rel.importantDates.length} ngày đặc biệt
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
