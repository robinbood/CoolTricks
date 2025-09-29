const stripe = require("stripe")(process.env.STRIPE_SECRET,{
    apiVersion:'2023-10-16'
})

const CreatePaymentIntent = async (req: Request) => {
    try {
        // creating  payment intent whihch is gonna be pre-set..the currency is in cents
        const paymentIntent = await stripe.paymentIntent.create({
            currency:"eur",
            amount:10,
            automatic_payment_methods:{
                enabled:true
            }
        })
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