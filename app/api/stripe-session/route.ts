// app/api/stripe-session/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Assurez-vous que votre instance Stripe est initialisée avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil', // Utilisez la même version que pour la création de session
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'ID de session manquant.' }, { status: 400 });
  }

  try {
    // Récupère la session Stripe avec les 'line_items' (articles achetés) et le 'payment_intent' (détails du paiement)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    // Optionnel: Vous pouvez vérifier le statut de la session ici si vous voulez
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Le paiement n\'a pas été finalisé pour cette session.' }, { status: 400 });
    }

    // Renvoie les détails pertinents de la session et du Payment Intent
    return NextResponse.json({ session, paymentIntent: session.payment_intent });

  } catch (error: any) {
    console.error('Erreur lors de la récupération de la session Stripe:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la récupération des détails de la session Stripe.' }, { status: 500 });
  }
}