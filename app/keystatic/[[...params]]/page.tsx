// app/keystatic/[[...params]]/page.tsx
'use client';

import '@keystar/ui/style';
export const dynamic = 'force-dynamic';

import { Keystatic } from '@keystatic/core/ui';
import type { Config as KSConfig } from '@keystatic/core';
import rawConfig from '../../../keystatic.config';
import Toolbar from '../toolbar';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

// Cast to base Config (generic mismatch in core UI types)
const config = rawConfig as unknown as KSConfig;

// Some Keystatic versions don’t surface props well; keep TS happy.
const KeystaticUI = Keystatic as unknown as React.ComponentType<any>;

export default function KeystaticPage() {
  const pathname = usePathname();

  const isItemView = useMemo(
    () => /\/collection\/[^/]+\/item\/[^/]+$/.test(pathname ?? ''),
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

  return (
    <div className="min-h-screen">
      <Toolbar />
      {!ready ? (
        <div style={{ padding: 8, background: '#F2C94C', color: '#219653', fontWeight: 700 }}>
          Preparing entry…
        </div>
      ) : (
        <div className="mt-3 max-h-[80vh] overflow-y-auto overscroll-contain pr-2">
          {/* CANARY: PAT mode (no OAuth) */}
          <div style={{padding:6, fontSize:12, background:'#F5F5F5', color:'#4F4F4F'}}>
            Admin UI: PAT mode (no OAuth) • CANARY-PAT-01
          </div>

          <KeystaticUI
            key={pathname}
            config={config}
            appSlug={{ value: 'keystatic', envName: 'KEYSTATIC_CMS_SLUG' }}
            /* apiPath removed to disable OAuth */
          />
        </div>
      )}
    </div>
  );
}
