import { createSupabaseServerClient } from "@/lib/supabase/server";

import { updateShipmentRequest } from "./actions";

export default async function AdminShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("shipment_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return <p>Error loading shipment: {error.message}</p>;
  }

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h1 style={{ marginBottom: 0 }}>Shipment {data.id}</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Created {new Date(data.created_at).toLocaleString()}
      </p>

      <div>
        <strong>Status:</strong> {data.status}
      </div>
      <div>
        <strong>Ship To:</strong> {data.ship_to_name}, {data.ship_to_address1}, {data.ship_to_city}, {data.ship_to_state} {data.ship_to_postal}, {data.ship_to_country}
      </div>
      <div>
        <strong>Package:</strong> {data.package_weight_lbs} lbs
      </div>
      {data.reference ? (
        <div>
          <strong>Reference:</strong> {data.reference}
        </div>
      ) : null}
      {data.notes ? (
        <div>
          <strong>Customer Notes:</strong> {data.notes}
        </div>
      ) : null}

      <form action={updateShipmentRequest} style={{ display: "grid", gap: 12 }}>
        <input type="hidden" name="id" value={data.id} />
        <label style={{ display: "grid", gap: 6 }}>
          <span>Update status</span>
          <select name="status" defaultValue={data.status}>
            <option value="NEW">NEW</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Internal notes</span>
          <textarea
            name="internalNotes"
            rows={4}
            defaultValue={data.internal_notes ?? ""}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </section>
  );
}
