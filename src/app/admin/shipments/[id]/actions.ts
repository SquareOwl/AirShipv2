"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["NEW", "REVIEWED", "COMPLETED", "REJECTED"]),
  internalNotes: z.string().optional().nullable(),
});

export async function updateShipmentRequest(formData: FormData) {
  await requireRole("ADMIN");

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    internalNotes: formData.get("internalNotes"),
  });

  if (!parsed.success) {
    throw new Error("Invalid update");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("shipment_requests")
    .update({
      status: parsed.data.status,
      internal_notes: parsed.data.internalNotes ?? null,
    })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  redirect(`/admin/shipments/${parsed.data.id}`);
}
