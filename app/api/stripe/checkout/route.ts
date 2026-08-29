import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST() {
  const session=await auth();
  if(!session?.user?.id) return NextResponse.redirect(new URL("/login",process.env.AUTH_URL||"http://localhost:3000"));
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);
  const user=await db.user.findUnique({where:{id:session.user.id},include:{subscription:true}});
  if(!user) return NextResponse.json({error:"User not found"},{status:404});
  let customerId=user.subscription?.stripeCustomerId||undefined;
  if(!customerId){const c=await stripe.customers.create({email:user.email,name:user.name||undefined,metadata:{userId:user.id}});customerId=c.id;await db.subscription.upsert({where:{userId:user.id},create:{userId:user.id,stripeCustomerId:c.id},update:{stripeCustomerId:c.id}});}
  const checkout=await stripe.checkout.sessions.create({mode:"subscription",customer:customerId,line_items:[{price:process.env.STRIPE_PRO_PRICE_ID!,quantity:1}],success_url:`${process.env.AUTH_URL}/dashboard?billing=success`,cancel_url:`${process.env.AUTH_URL}/pricing`,subscription_data:{metadata:{userId:user.id}}});
  return NextResponse.redirect(checkout.url!,303);
}
