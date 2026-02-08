import { createSupabaseServerClient } from "@/lib/supabase/server";

import { createCustomer } from "./actions";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Users</h1>
        <p style={{ marginTop: 0, opacity: 0.8 }}>
          Create customer accounts (no public signup).
        </p>
      </div>

      <form action={createCustomer} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Customer email</span>
          <input name="email" type="email" required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Temporary password</span>
          <input name="password" type="text" required minLength={8} />
        </label>
        <button type="submit">Create customer</button>
      </form>

      <div>
        <h2 style={{ marginBottom: 8 }}>Latest profiles</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {(data ?? []).map((p) => (
            <li key={p.id}>
              {p.id} — {p.role}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
