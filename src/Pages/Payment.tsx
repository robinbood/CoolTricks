import { useState,useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const Payment  = () => {
    const [clientSecret , SetClientSecret] = useState<string>("")
    const publishable = process.env.STRIPE_PUBLIC!
    const stripePromise = loadStripe(publishable)

    useEffect( () => {
        fetch("http://localhost:3000/create-payment-intent",{
            method:"POST",
            body:JSON.stringify({})
        }).then (async (result) => {
            const {clientSecret} = await result.json()
            SetClientSecret(clientSecret)
        })
    },[]);
    return (
        <div>
            <h1>Let's go premium ":rocket:"</h1>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{clientSecret}}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    )
}
export default Payment