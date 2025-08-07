"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"

export default function OurTeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation language="en" onLanguageChange={() => {}} />

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our dedicated staff work across Timor-Leste to bring education, inspiration, and resources to communities. More information about each team member will be added here soon.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 text-lg">
            📌 Team bios and department details coming soon.
          </p>
          <p className="text-gray-600 mt-4">
            Check back soon to learn more about the people behind Lafaek Learning Media.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Want to Join Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're always looking for passionate individuals committed to education, storytelling, and community impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                View Open Positions
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
