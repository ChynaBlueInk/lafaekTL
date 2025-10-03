// app/keystatic/layout.tsx
import KeystaticApp from './keystatic';
import Toolbar from './toolbar';

export default function Layout() {
  // pt-20 ≈ 80px. Tweak to match your navbar height if needed.
  return (
    <div className="min-h-screen bg-white pt-20">
      <Toolbar />
      <KeystaticApp />
    </div>
  );
}
