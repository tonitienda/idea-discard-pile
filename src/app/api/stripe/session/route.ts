import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../backend/users";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("process.env.STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { priceId } = await req.json(); // receive priceId from frontend
  const customerEmail = user.email;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId, // Stripe price ID
          quantity: 1,
        },
      ],
      customer_email: customerEmail, // The user's email
      success_url: `${process.env.NEXT_PUBLIC_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/stripe/cancel`,
    });
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.log("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
