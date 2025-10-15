// app/keystatic/[[...params]]/page.tsx
'use client';

import '@keystar/ui/style';
export const dynamic = 'force-dynamic';

import { Keystatic } from '@keystatic/core/ui';
import type { Config as KSConfig } from '@keystatic/core';
import rawConfig from '../../../keystatic.config';
import Toolbar from '../toolbar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Cast to base Config (generic mismatch in core UI types)
const config = rawConfig as unknown as KSConfig;

export default function KeystaticPage() {
  const pathname = usePathname();
  const router = useRouter();

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

  // (We’ll keep the rest of your logic as-is; this step only adds the scroll wrapper.)
  return (
    <div className="min-h-screen">
      <Toolbar />
      {!ready ? (
        <div style={{ padding: 8, background: '#F2C94C', color: '#219653', fontWeight: 700 }}>
          Preparing entry…
        </div>
      ) : (
        // ⬇️ NEW: give the admin area its own scrollable viewport
        <div className="mt-3 max-h-[80vh] overflow-y-auto overscroll-contain pr-2">
          <Keystatic
            key={pathname}
            config={config}
            appSlug={{ value: 'keystatic', envName: 'KEYSTATIC_CMS_SLUG' }}
          />
        </div>
      )}
    </div>
  );
}
