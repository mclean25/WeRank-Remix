import type { Db, SupabaseClient } from "~/supabase";

export const getPosts = async (supabaseClient: SupabaseClient) =>
  await supabaseClient.from("posts").select("*");

export const createPost = async (
  supabaseClient: SupabaseClient,
  inputArgs: Db["posts"]["Insert"]
) => await supabaseClient.from("posts").insert([inputArgs]).returns();
