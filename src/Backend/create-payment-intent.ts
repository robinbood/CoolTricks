const stripe = require("stripe")(process.env.STRIPE_SECRET,{
    apiVersion:'2023-10-16'
})

const CreatePaymentIntent = async (req: Request) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currenncy:"eur",
            amount:10,
            automatic_payment_methods:{
                enabled:true
            }
        })
        return new Response (JSON.stringify({
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