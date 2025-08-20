import { supabase } from "./supabase";

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // persist token in localStorage
  if (data.session?.access_token) {
    localStorage.setItem("access_token", data.session.access_token);
  }

  return data.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  if (data.session?.access_token) {
    localStorage.setItem("access_token", data.session.access_token);
  }

  return data.user;
}

export function signOut() {
  localStorage.removeItem("access_token");
  return supabase.auth.signOut();
}