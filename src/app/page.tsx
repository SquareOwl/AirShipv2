import Link from "next/link";

import { getCurrentProfile } from "@/lib/auth";

export default async function Home() {
  const profile = await getCurrentProfile();

  const primaryHref =
    profile?.role === "ADMIN"
      ? "/admin"
      : profile?.role === "CUSTOMER"
        ? "/intake"
        : "/login";

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>AirShip</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Shipping intake form for customers and an admin dashboard.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link href={primaryHref}>Continue</Link>
        <Link href="/login">Login</Link>
        <Link href="/logout">Logout</Link>
      </div>
    </main>
  );
}

