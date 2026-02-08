"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const optionalPositiveNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().positive().optional(),
);

const intakeSchema = z.object({
  shipToName: z.string().min(1),
  shipToAddress1: z.string().min(1),
  shipToCity: z.string().min(1),
  shipToState: z.string().min(1),
  shipToPostal: z.string().min(1),
  shipToCountry: z.string().min(2),
  packageWeightLbs: z.coerce.number().positive(),
  packageLengthIn: optionalPositiveNumber,
  packageWidthIn: optionalPositiveNumber,
  packageHeightIn: optionalPositiveNumber,
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function createShipmentRequest(formData: FormData) {
  await requireRole("CUSTOMER");

  const parsed = intakeSchema.safeParse({
    shipToName: formData.get("shipToName"),
    shipToAddress1: formData.get("shipToAddress1"),
    shipToCity: formData.get("shipToCity"),
    shipToState: formData.get("shipToState"),
    shipToPostal: formData.get("shipToPostal"),
    shipToCountry: formData.get("shipToCountry"),
    packageWeightLbs: formData.get("packageWeightLbs"),
    packageLengthIn: formData.get("packageLengthIn"),
    packageWidthIn: formData.get("packageWidthIn"),
    packageHeightIn: formData.get("packageHeightIn"),
    reference: formData.get("reference"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error("Invalid intake form");
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("shipment_requests")
    .insert({
      user_id: user.id,
      ship_to_name: parsed.data.shipToName,
      ship_to_address1: parsed.data.shipToAddress1,
      ship_to_city: parsed.data.shipToCity,
      ship_to_state: parsed.data.shipToState,
      ship_to_postal: parsed.data.shipToPostal,
      ship_to_country: parsed.data.shipToCountry,
      package_weight_lbs: parsed.data.packageWeightLbs,
      package_length_in: parsed.data.packageLengthIn ?? null,
      package_width_in: parsed.data.packageWidthIn ?? null,
      package_height_in: parsed.data.packageHeightIn ?? null,
      reference: parsed.data.reference ?? null,
      notes: parsed.data.notes ?? null,
      status: "NEW",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/intake/thanks?id=${encodeURIComponent(data.id)}`);
}
