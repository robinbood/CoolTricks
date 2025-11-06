const getPublishableKey = async (req: Request) => {
    try {
        return new Response(JSON.stringify({
            publishableKey: process.env.STRIPE_PUBLIC!
        }))
    } catch (error : unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({
            message: errorMessage
        }))
    }
}

export default getPublishableKey;