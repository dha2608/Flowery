'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4', className)}>
      <ol
        className="flex flex-wrap items-center gap-1.5 text-sm"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home link */}
        <li
          className="flex items-center"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            className="flex items-center gap-1 text-stone-500 transition-colors hover:text-stone-700"
            itemProp="item"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only" itemProp="name">
              Trang chủ
            </span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="h-4 w-4 text-stone-300" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-stone-500 transition-colors hover:text-stone-700 hover:underline"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="font-medium text-stone-800" itemProp="name" aria-current="page">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
