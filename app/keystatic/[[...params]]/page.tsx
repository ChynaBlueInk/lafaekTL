// app/keystatic/[[...params]]/page.tsx
export const dynamic = 'force-dynamic';

import { Keystatic } from '@keystatic/core/ui';
import config from '../../../keystatic.config';

export default function KeystaticPage() {
  return <Keystatic config={config} />;
}
