import { drizzle } from "drizzle-orm/bun-sql";
import { eq, desc } from "drizzle-orm";
import { SQL } from "bun";
import { posts } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { posts } });

const getUserPosts = async (req: Request, userId: number) => {
  try {
    // Get URL parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get user posts with pagination
    const userPosts = await db.query.posts.findMany({
      where: eq(posts.userId, userId),
      orderBy: [desc(posts.createdAt)],
      limit: limit,
      offset: offset,
      columns: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get total count for pagination info
    const totalCountResult = await db.select({ count: posts.id }).from(posts).where(eq(posts.userId, userId));
    const totalCount = totalCountResult.length;

    return new Response(
      JSON.stringify({
        posts: userPosts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({
        message: "Failed to fetch user posts",
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

export default getUserPosts;