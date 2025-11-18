// components/Footer.tsx
"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-white/10 pb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Lafaek TL</h3>
          <p className="text-sm text-gray-300">
            Supporting children and families in Timor-Leste through education, creativity, and community engagement.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Site Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/publication/magazines">Magazines</Link></li>
            <li><Link href="/learning">Learning</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/our-team">Team</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <p className="text-sm text-gray-300">
            For partnership, sponsorship, or media enquiries, please contact the Lafaek team.
          </p>
          <p className="mt-2 text-sm text-gray-300">
            <Link href="/contact" className="underline">
              Go to Contact Page
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Lafaek TL. All rights reserved.
      </div>
    </footer>
  );
}
