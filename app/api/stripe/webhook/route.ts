import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";

export async function POST(req:Request){
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig=(await headers()).get("stripe-signature");
  if(!sig) return new Response("Missing signature",{status:400});
  const body=await req.text();
  let event:Stripe.Event;
  try{event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET!);}catch(e){return new Response("Invalid signature",{status:400});}

  if(event.type==="checkout.session.completed"){
    const s=event.data.object as Stripe.Checkout.Session;
    const userId=s.metadata?.userId;
    if(userId) await db.subscription.update({where:{userId},data:{plan:"PRO",status:"ACTIVE",stripeCustomerId:String(s.customer),stripeSubscriptionId:String(s.subscription)}});
  }
  if(event.type==="customer.subscription.deleted" || event.type==="customer.subscription.updated"){
    const s=event.data.object as Stripe.Subscription;
    const sub=await db.subscription.findUnique({where:{stripeSubscriptionId:s.id}});
    if(sub) await db.subscription.update({where:{id:sub.id},data:{status:s.status==="active"?"ACTIVE":s.status==="trialing"?"TRIALING":s.status==="past_due"?"PAST_DUE":"CANCELED",cancelAtPeriodEnd:s.cancel_at_period_end,currentPeriodEnd:new Date(s.items.data[0]?.current_period_end*1000)}});
  }
  return Response.json({received:true});
}
