// app/keystatic/keystatic.tsx
'use client';

import { Keystatic } from '@keystatic/core/ui';
import keystaticConfig from '../../keystatic.config';

export default function EditorShell() {
  // Keystatic’s prop is a non-generic Config; cast avoids a noisy TS mismatch.
  return (
    <div className="min-h-screen">
      <Keystatic config={keystaticConfig as any} />
    </div>
  );
}
