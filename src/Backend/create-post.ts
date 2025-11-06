import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import { posts } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { posts } });

const createPost = async (req: Request, userId: number) => {
  try {
    const { title, content } = await req.json();

    // Validate input
    if (!title || !content) {
      return new Response(
        JSON.stringify({
          message: "Title and content are required",
        }),
        {
          status: 400,
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    }

    // Create new post
    const newPost = await db.insert(posts).values({
      title,
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return new Response(
      JSON.stringify({
        message: "Post created successfully",
        post: newPost[0],
      }),
      {
        status: 201,
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({
        message: "Failed to create post",
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  }
};

export default createPost;