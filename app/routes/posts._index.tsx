import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost, getPosts } from "~/models/posts.server";
import { createSupabaseServerClient } from "~/supabase";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// Need to import this here since the route needs to handle the action
export const action = async ({ request, ...args }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formAction = formData.get("intent");

  if (formAction === "create") {
    const response = new Response();

    const formData = await request.formData();

    const title = formData.get("title");
    invariant(typeof title === "string", "title must be a string");

    const result = await createPost(
      createSupabaseServerClient(request, response),
      {
        title: title,
      }
    );

    // in order for the set-cookie header to be set,
    // headers must be returned as part of the loader response
    return json(
      {
        data: result,
      },
      {
        headers: response.headers,
      }
    );
  }
};

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
  const { data } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Posts</h1>
      <div>
        {data?.map((post) => (
          <div key={post.id}>
            <div
              style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
            >
              <div>{post.id}</div>
              <h1>{post.title}</h1>
              <span className="underline lowercase">Delete</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Form method="post">
          <p>
            <label>
              Post Title:{" "}
              <input
                type="text"
                name="title"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </label>
          </p>
          <p className="text-right">
            <button
              type="submit"
              name="intent"
              value="create"
              className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            >
              Create Post
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
}
