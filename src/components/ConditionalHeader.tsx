'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Не отображаем этот хедер на странице расписания
  if (pathname === '/schedule') {
    return null;
  }

  return <SiteHeader />;
} 