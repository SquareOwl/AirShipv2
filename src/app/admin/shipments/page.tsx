import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminShipmentsPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("shipment_requests")
    .select(
      "id, created_at, status, reference, ship_to_name, ship_to_city, ship_to_state, ship_to_postal",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return <p>Error loading shipments: {error.message}</p>;
  }

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Shipments</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Latest 50 shipment requests.</p>

      <table cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>ID</th>
            <th>Created</th>
            <th>Status</th>
            <th>Reference</th>
            <th>Ship To</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>
                <Link href={`/admin/shipments/${row.id}`}>{row.id}</Link>
              </td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
              <td>{row.status}</td>
              <td>{row.reference ?? "—"}</td>
              <td>
                {row.ship_to_name} — {row.ship_to_city}, {row.ship_to_state} {row.ship_to_postal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
