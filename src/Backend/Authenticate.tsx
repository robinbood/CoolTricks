import { RedisClient } from "bun";
const store = new RedisClient();

// authenticate a user  to see if his session id is still valid 
const Authenticate = async (req: Request) => {
    const cookieHeader = req.headers.get("cookie")
    const hasCookie = cookieHeader?.startsWith("sessionId=")
    if(!hasCookie){
        return Response.redirect("./Signin")
    }
    const key = cookieHeader?.split("=")[1]?.split(";")[0]
    if (!key) {
        return Response.redirect("./Signin")
    }
    // get the keys from redis cache
    try {
        const [userid] = await store.hmget(key,[
            "userId"
        ])
        return {
            userId: Number(userid)
        } as { userId: number };

    } catch (error:unknown) {
        console.log("Auth error",error);
        return new Response(
            JSON.stringify({
                message: "Authentication failed",
                error: error instanceof Error ? error.message : "Unknown error"
            }),
            {
                status: 401,
            }
        );
    }
}

export default Authenticate;