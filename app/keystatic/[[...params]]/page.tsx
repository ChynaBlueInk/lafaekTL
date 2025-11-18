// app/keystatic/[[...params]]/page.tsx
'use client';

import '@keystar/ui/style';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Keystatic } from '@keystatic/core/ui';
import type { Config as KSConfig } from '@keystatic/core';

import rawConfig from '../../../keystatic.config';
import Toolbar from '../toolbar';

// Cast to base Config shape
const config = rawConfig as unknown as KSConfig;

// Some Keystatic versions don’t surface props well; keep TS happy.
const KeystaticUI = Keystatic as unknown as React.ComponentType<any>;

// Choose mode via env: "PAT" (no OAuth) or default "OAUTH"
const MODE = (process.env.NEXT_PUBLIC_KEYSTATIC_MODE || 'OAUTH').toUpperCase();

export default function KeystaticPage() {
  const pathname = usePathname();

  // Detect single-item view (edit/create) — reduces hydration flicker
  const isItemView = useMemo(
    () => /\/collection\/[^/]+\/(item|create)(\/[^/]+)?$/.test(pathname ?? ''),
    [pathname]
  );

  const [ready, setReady] = useState(!isItemView);
  useEffect(() => {
    if (!isItemView) {
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, [isItemView, pathname]);

  const isPAT = MODE === 'PAT';

  return (
    <div className="min-h-screen">
      <Toolbar />
      {!ready ? (
        <div
          style={{
            padding: 8,
            background: '#F2C94C', // Lafaek Yellow
            color: '#219653',       // Lafaek Green
            fontWeight: 700,
          }}
        >
          Preparing entry…
        </div>
      ) : (
        <div className="mt-3 max-h-[80vh] overflow-y-auto overscroll-contain pr-2">
          {isPAT && (
            <div style={{ padding: 6, fontSize: 12, background: '#F5F5F5', color: '#4F4F4F' }}>
              Admin UI: PAT mode (no OAuth) • CANARY-PAT-01
            </div>
          )}

          <KeystaticUI
            key={pathname}
            config={config}
            // OAuth mode: point UI at API so GitHub sign-in appears
            {...(!isPAT ? { apiPath: '/api/keystatic' } : {})}
            // Keystatic expects an object with envName + value
            appSlug={{
              envName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
              value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
            }}
          />
        </div>
      )}
    </div>
  );
}
