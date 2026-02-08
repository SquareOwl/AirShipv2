import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "./supabase/server";

export type Role = "ADMIN" | "CUSTOMER";

export type Profile = {
  id: string;
  role: Role;
  created_at: string;
};

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  return data as Profile | null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(requiredRole: Role) {
  await requireAuth();
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== requiredRole) redirect("/");
  return profile;
}
