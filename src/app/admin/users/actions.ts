"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

const createCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createCustomer(formData: FormData) {
  await requireRole("ADMIN");

  const parsed = createCustomerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error("Invalid user");
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User not created");

  // Ensure profile exists and role is CUSTOMER.
  const supabase = await createSupabaseServerClient();
  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    role: "CUSTOMER",
  });
  if (upsertError) throw new Error(upsertError.message);

  revalidatePath("/admin/users");
}
