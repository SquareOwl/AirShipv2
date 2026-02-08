import Link from "next/link";

import { requireRole } from "@/lib/auth";

import { createShipmentRequest } from "./actions";
import PackagesInput from "./packages-input";

export default async function IntakePage() {
  await requireRole("CUSTOMER");

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Shipping Intake</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Submit a shipment request for the ops team.
      </p>

      <form action={createShipmentRequest} style={{ display: "grid", gap: 12 }}>
        <fieldset style={{ display: "grid", gap: 12 }}>
          <legend>Ship From</legend>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Name</span>
            <input name="shipFromName" required />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Address</span>
            <input name="shipFromAddress1" required />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>City</span>
              <input name="shipFromCity" required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>State/Prov</span>
              <input name="shipFromState" required />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Postal</span>
              <input name="shipFromPostal" required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Country</span>
              <input name="shipFromCountry" defaultValue="US" required />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Email</span>
              <input name="shipperEmail" type="email" required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Phone</span>
              <input name="shipperPhone" required />
            </label>
          </div>
        </fieldset>

        <fieldset style={{ display: "grid", gap: 12 }}>
          <legend>Ship To</legend>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Name</span>
            <input name="shipToName" required />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Address</span>
            <input name="shipToAddress1" required />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>City</span>
              <input name="shipToCity" required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>State/Prov</span>
              <input name="shipToState" required />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Postal</span>
              <input name="shipToPostal" required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Country</span>
              <input name="shipToCountry" defaultValue="US" required />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Email</span>
              <input name="recipientEmail" type="email" required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Phone</span>
              <input name="recipientPhone" required />
            </label>
          </div>
        </fieldset>

        <fieldset style={{ display: "grid", gap: 12 }}>
          <legend>Package</legend>
          <PackagesInput />
        </fieldset>

        <fieldset style={{ display: "grid", gap: 12 }}>
          <legend>Extras</legend>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Declared value (USD)</span>
            <input name="declaredValue" type="number" step="0.01" />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Contents description</span>
            <input name="contentsDescription" />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Requested pickup date</span>
            <input name="pickupDate" type="date" />
          </label>
        </fieldset>

        <fieldset style={{ display: "grid", gap: 12 }}>
          <legend>References</legend>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Reference (optional)</span>
            <input name="reference" />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Notes (optional)</span>
            <textarea name="notes" rows={4} />
          </label>
        </fieldset>

        <button type="submit">Submit request</button>
      </form>

      <p style={{ marginTop: 16 }}>
        <Link href="/logout">Logout</Link>
      </p>
    </main>
  );
}
