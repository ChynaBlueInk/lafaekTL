import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Friends of Lafaek | Lafaek Learning Media",
  description:
    "Join Friends of Lafaek — volunteer, sponsor, and support education and community in Timor-Leste.",
}

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
