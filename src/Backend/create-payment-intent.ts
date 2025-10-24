const stripe = require("stripe")(process.env.STRIPE_SECRET,{
    apiVersion:'2024-04-10'
})

// In a real application, you would fetch this from a database
const products = {
    "premium": {
        "name": "Premium Plan",
        "price": 1000 // in cents
    }
}

const CreatePaymentIntent = async (req: Request) => {
    try {
        const { productId, idempotencyKey } = await req.json();
        const product = products[productId as keyof typeof products];

        if (!product) {
            return new Response(JSON.stringify({
                message: "Invalid product ID"
            }), { status: 400 });
        }

        // creating  payment intent whihch is gonna be pre-set..the currency is in cents
        const paymentIntent = await stripe.paymentIntents.create({
            currency:"eur",
            amount: product.price,
            automatic_payment_methods:{
                enabled:true
            }
        }, { idempotencyKey })
        return new Response (JSON.stringify({
            // client_secret is a predefined field btw
            
            clientSecret:paymentIntent.client_secret
        }))
    } catch (error : unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({
            message: errorMessage
        }))
    }
}

export default CreatePaymentIntent;