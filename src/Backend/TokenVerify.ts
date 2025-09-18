import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { SQL } from "bun";
import { users, tokens } from "@/Schema/Schema";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { users, tokens } });

const TokenVerify = async (req: Request) => {
    const {token} = await req.json()


    const result = await db.query.tokens.findFirst({
        where : eq(tokens.token,token),
        with : {
            user:users
        }
    })

    if (!result) {
        return Response.redirect("/signup")
    }

    const u
    

    return new Response(JSON.stringify({
       message:"" 
    }))

    


} 

export default TokenVerify;