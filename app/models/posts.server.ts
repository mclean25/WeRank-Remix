import type { SupabaseClient, SupabaseTables } from "~/supabase";

export const getPosts = async (supabaseClient: SupabaseClient) =>
  await supabaseClient.from("posts").select("*");

export const createPost = async (
  supabaseClient: SupabaseClient,
  inputArgs: SupabaseTables["posts"]["Insert"]
) => await supabaseClient.from("posts").insert([inputArgs]).returns();
