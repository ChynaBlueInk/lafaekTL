"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/10 pb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Lafaek TL</h3>
          <p className="text-sm text-gray-300">
            Supporting children and families in Timor-Leste through education, creativity, and community engagement.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/magazines">Our Products</Link></li>
            <li><Link href="/kids">For Kids</Link></li>
            <li><Link href="/library/books">Library</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">More Info</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/news">News</Link></li>
            <li><Link href="/impact-stories">Impact Stories</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Get Involved</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/get-involved#partner">Partner With Us</Link></li>
            <li><Link href="/get-involved#sponsor">Sponsor a Program</Link></li>
            <li><Link href="/get-involved#volunteer">Volunteer</Link></li>
            <li><Link href="/get-involved#donate">Donate</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Lafaek TL. All rights reserved.
      </div>
    </footer>
  )
}
