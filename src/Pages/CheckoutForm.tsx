import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeError, PaymentIntent } from "@stripe/stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      
      return;
    }

    setIsProcessing(true);

    const {error,paymentIntent} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // this runs if the payment was successful
        return_url: `${window.location.origin}/completion`,
      },
      redirect:"if_required"
    }) as { error?: StripeError; paymentIntent?: PaymentIntent };

    if (error) {
      setMessage(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // xwe should have defined this in a better to incrase a micromilisecond response time
      setMessage("payment status : " + paymentIntent.status + ":taco:");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
