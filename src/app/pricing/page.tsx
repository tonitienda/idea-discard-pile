"use client";

import { StoreProvider } from "easy-peasy";
import React from "react";
import { store, useStoreActions } from "../../store";
import { trackSubscriptionIntent } from "../../client/ga";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function PricingPage() {
  const addNotification = useStoreActions((actions) => actions.addNotification);

  const subscribeClick = async (plan: string) => {
    const stripe = await stripePromise;

    const priceIds = {
      premium: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM,
      "premium+": process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM_PLUS,
      support: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_SUPPORT,
    };

    try {
      // Make API call to create the Stripe checkout session
      const response = await fetch("/api/stripe/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceIds[plan],
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe checkout error:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }

    addNotification({
      level: "info",
      message: `Premuim features are coming soon!`,
    });

    trackSubscriptionIntent(plan);
  };

  return (
    <div className="container">
      <div className="card mt-5">
        <div className="card-body">
          <h3 className="card-title">Support the Platform</h3>
          <p className="card-text">
            By subscribing to a Premium plan, you're not just unlocking
            additional features—you're helping to keep the platform alive and
            support its continued development. As an indie developer, I rely on
            your support to maintain and improve the service. Your subscription
            helps cover the costs of hosting, scaling, and building new
            features. Plus, it ensures that core features remain free for
            everyone.
          </p>
          <p className="card-text">
            Thank you for being part of this journey and for helping to create a
            space where great ideas can thrive.
          </p>
        </div>
      </div>
      <h1 className="text-center mb-4">Choose Your Plan</h1>

      <div className="row d-flex justify-content-center">
        <div className="col-md-4 d-flex">
          <div className="card mb-4 box-shadow flex-fill d-flex flex-column">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Free</h4>
            </div>
            <div className="card-body d-flex flex-column">
              <h1 className="card-title pricing-card-title">
                $0 <small className="text-muted">/ mo</small>
              </h1>
              <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                <li>Submit up to 2 ideas per hour</li>
                <li>React to ideas</li>
                <li>View the number of reactions on ideas</li>
                <li>Reply to threads on your own ideas (Coming soon)</li>
              </ul>
              <button
                type="button"
                className="btn btn-lg btn-block btn-outline-primary mt-auto"
                disabled
              >
                Current Plan
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 d-flex">
          <div className="card mb-4 box-shadow flex-fill d-flex flex-column">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Premium</h4>
            </div>
            <div className="card-body d-flex flex-column">
              <h1 className="card-title pricing-card-title">
                $3.99 <small className="text-muted">/ mo</small>
              </h1>
              <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                <li>Everything in the Free Plan</li>
                <li>Submit up to 5 ideas per hour</li>
                <li>Bookmark ideas (access ideas you've reacted to)</li>
                <li>Start conversations on any idea</li>
                <li>See the list of users who reacted to your ideas</li>
              </ul>
              <button
                type="button"
                className="btn btn-lg btn-block btn-primary mt-auto"
                onClick={() => subscribeClick("premium")}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 d-flex">
          <div className="card mb-4 box-shadow flex-fill d-flex flex-column">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Premium+</h4>
            </div>
            <div className="card-body d-flex flex-column">
              <h1 className="card-title pricing-card-title">
                $7.99 <small className="text-muted">/ mo</small>
              </h1>
              <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                <li>Everything in the Premium Plan</li>
                <li>Submit up to 10 ideas per hour</li>
                <li>See the list of users who reacted to any idea</li>
              </ul>
              <button
                type="button"
                className="btn btn-lg btn-block btn-primary mt-auto"
                onClick={() => subscribeClick("premium+")}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPageWithStore() {
  return (
    <StoreProvider store={store}>
      <PricingPage />
    </StoreProvider>
  );
}
