import Link from "next/link";

import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireRole("ADMIN");

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <strong>Admin</strong>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/shipments">Shipments</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/logout">Logout</Link>
        </nav>
      </header>
      <div style={{ marginTop: 16 }}>{children}</div>
    </main>
  );
}
