import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const serverClient = createSupabaseServerClient(request, response);
    await serverClient.auth.exchangeCodeForSession(code);
  }

  return redirect("/", {
    headers: response.headers,
  });
};
