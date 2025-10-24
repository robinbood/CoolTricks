import { useState,useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const Payment  = () => {
    const [clientSecret , SetClientSecret] = useState<string>("")
    const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublishableKey = async () => {
            try {
                const response = await fetch("http://localhost:3000/get-publishable-key");
                const { publishableKey } = await response.json();
                setStripePromise(loadStripe(publishableKey));
            } catch (error) {
                console.error("Error fetching publishable key:", error);
            }
        };
        fetchPublishableKey();
    }, []);

    useEffect( () => {
        const fetchClientSecret = async () => {
            try {
                const response = await fetch("http://localhost:3000/create-payment-intent",{
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({ productId: "premium", idempotencyKey: Date.now() })
                });
                const {clientSecret} = await response.json();
                SetClientSecret(clientSecret);
            } catch (error) {
                console.error("Error fetching client secret:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchClientSecret();
    },[]);

    return (
        <div>
            <h1>Let's go premium ":rocket:"</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{clientSecret}}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    )
}
export default Payment