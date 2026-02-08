"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const optionalPositiveNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().positive().optional(),
);

const packageSchema = z.object({
  weightLbs: z.coerce.number().positive(),
  lengthIn: optionalPositiveNumber,
  widthIn: optionalPositiveNumber,
  heightIn: optionalPositiveNumber,
});

const intakeSchema = z.object({
  shipFromName: z.string().min(1),
  shipFromAddress1: z.string().min(1),
  shipFromCity: z.string().min(1),
  shipFromState: z.string().min(1),
  shipFromPostal: z.string().min(1),
  shipFromCountry: z.string().min(2),
  shipperEmail: z.string().email(),
  shipperPhone: z.string().min(1),
  shipToName: z.string().min(1),
  shipToAddress1: z.string().min(1),
  shipToCity: z.string().min(1),
  shipToState: z.string().min(1),
  shipToPostal: z.string().min(1),
  shipToCountry: z.string().min(2),
  recipientEmail: z.string().email(),
  recipientPhone: z.string().min(1),
  packages: z.array(packageSchema).min(1),
  declaredValue: optionalPositiveNumber,
  contentsDescription: z.string().optional().nullable(),
  pickupDate: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function createShipmentRequest(formData: FormData) {
  await requireRole("CUSTOMER");

  const weights = formData.getAll("packageWeightLbs");
  const lengths = formData.getAll("packageLengthIn");
  const widths = formData.getAll("packageWidthIn");
  const heights = formData.getAll("packageHeightIn");

  const packages = weights
    .map((weight, index) => ({
      weightLbs: weight,
      lengthIn: lengths[index] ?? null,
      widthIn: widths[index] ?? null,
      heightIn: heights[index] ?? null,
    }))
    .filter((pkg) => String(pkg.weightLbs).trim() !== "");

  const parsed = intakeSchema.safeParse({
    shipFromName: formData.get("shipFromName"),
    shipFromAddress1: formData.get("shipFromAddress1"),
    shipFromCity: formData.get("shipFromCity"),
    shipFromState: formData.get("shipFromState"),
    shipFromPostal: formData.get("shipFromPostal"),
    shipFromCountry: formData.get("shipFromCountry"),
    shipperEmail: formData.get("shipperEmail"),
    shipperPhone: formData.get("shipperPhone"),
    shipToName: formData.get("shipToName"),
    shipToAddress1: formData.get("shipToAddress1"),
    shipToCity: formData.get("shipToCity"),
    shipToState: formData.get("shipToState"),
    shipToPostal: formData.get("shipToPostal"),
    shipToCountry: formData.get("shipToCountry"),
    recipientEmail: formData.get("recipientEmail"),
    recipientPhone: formData.get("recipientPhone"),
    packages,
    declaredValue: formData.get("declaredValue"),
    contentsDescription: formData.get("contentsDescription"),
    pickupDate: formData.get("pickupDate"),
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
      ship_from_name: parsed.data.shipFromName,
      ship_from_address1: parsed.data.shipFromAddress1,
      ship_from_city: parsed.data.shipFromCity,
      ship_from_state: parsed.data.shipFromState,
      ship_from_postal: parsed.data.shipFromPostal,
      ship_from_country: parsed.data.shipFromCountry,
      shipper_email: parsed.data.shipperEmail,
      shipper_phone: parsed.data.shipperPhone,
      ship_to_name: parsed.data.shipToName,
      ship_to_address1: parsed.data.shipToAddress1,
      ship_to_city: parsed.data.shipToCity,
      ship_to_state: parsed.data.shipToState,
      ship_to_postal: parsed.data.shipToPostal,
      ship_to_country: parsed.data.shipToCountry,
      recipient_email: parsed.data.recipientEmail,
      recipient_phone: parsed.data.recipientPhone,
      declared_value: parsed.data.declaredValue ?? null,
      contents_description: parsed.data.contentsDescription ?? null,
      pickup_date: parsed.data.pickupDate || null,
      reference: parsed.data.reference ?? null,
      notes: parsed.data.notes ?? null,
      status: "NEW",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const packagesInsert = parsed.data.packages.map((pkg) => ({
    shipment_request_id: data.id,
    weight_lbs: pkg.weightLbs,
    length_in: pkg.lengthIn ?? null,
    width_in: pkg.widthIn ?? null,
    height_in: pkg.heightIn ?? null,
  }));

  const { error: packageError } = await supabase
    .from("shipment_packages")
    .insert(packagesInsert);

  if (packageError) {
    throw new Error(packageError.message);
  }

  redirect(`/intake/thanks?id=${encodeURIComponent(data.id)}`);
}
