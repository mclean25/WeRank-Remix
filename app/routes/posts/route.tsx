import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/posts.server";
import { createSupabaseServerClient } from "~/supabase";
import NewPost, { createPostAction } from "./posts.new";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Need to import this here since the route needs to handle the action
export const action = createPostAction;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const result = await getPosts(createSupabaseServerClient(request, response));

  return json(
    {
      data: result.data,
    },
    {
      headers: response.headers,
    }
  );
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Posts</h1>
      <div>{JSON.stringify(data, null, 2)}</div>
      <NewPost />
    </div>
  );
}
