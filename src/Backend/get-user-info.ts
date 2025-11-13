import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users, subscriptions } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { users, subscriptions } });

const getUserInfo = async (userId: number) => {
  try {
    // Get user information
    const userInfo = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        name: true,
        username: true,
      },
    });

    if (!userInfo) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 404,
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    }

    // Get subscription status separately
    const subscriptionInfo = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.user, userId),
      columns: {
        premium: true,
      },
    });

    return new Response(
      JSON.stringify({
        user: userInfo,
        isPremium: subscriptionInfo?.premium || false,
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
        message: "Failed to fetch user info",
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

export default getUserInfo;