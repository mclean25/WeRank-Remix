import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost } from "~/models/posts.server";
import { createSupabaseServerClient } from "~/supabase";

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export const createPostAction = async ({ request }: ActionFunctionArgs) => {
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
      data: title,
    },
    {
      headers: response.headers,
    }
  );
};

export default function NewPost() {
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
