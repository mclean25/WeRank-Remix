import { createServerClient, parse, serialize } from "@supabase/ssr";
import type { Database } from "types/database-types";

export type SupabaseClient = ReturnType<typeof createSupabaseServerClient>;
export type SupabaseTables = Database["public"]["Tables"];

export const createSupabaseServerClient = (
  request: Request,
  response: Response
) => {
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const serverClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          response.headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          response.headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return serverClient;
};
