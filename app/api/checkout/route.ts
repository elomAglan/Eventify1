import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Assurez-vous que cette importation est correcte et initialise Stripe

export async function POST(req: NextRequest) {
  // Récupération des données envoyées par le frontend (EventBookingSidebar)
  const { userId, eventId, quantity, price, eventTitle } = await req.json();

  // --- 1. Validation des données reçues ---
  if (!userId || !eventId || !quantity || price === undefined || price === null || !eventTitle) {
    // Retourne une erreur si des champs essentiels sont manquants
    return new NextResponse("Champs requis manquants pour la création de la session de paiement.", { status: 400 });
  }

  // --- 2. Préparation du prix pour Stripe (en CFA) ---
  // Stripe s'attend à ce que le montant soit en "unités minimales" de la devise.
  // Pour le Franc CFA (XOF), l'unité minimale est le franc lui-même (pas de centimes).
  // Donc, si 'price' est déjà un nombre entier en CFA (par exemple, 15000 pour 15 000 XOF),
  // il n'y a pas besoin de multiplier par 100 comme pour l'USD ou l'EUR.
  const amountInCFA = Math.round(price); // Assure que c'est un entier, au cas où.

  try {
    // --- 3. Création de la session de paiement Stripe Checkout ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Méthodes de paiement acceptées (ici, seulement les cartes)
      mode: "payment", // Mode de la session : "payment" pour un paiement unique
      locale: "fr", // Langue de la page de paiement Stripe (français)
      line_items: [ // Les articles que l'utilisateur achète
        {
          price_data: {
            currency: "XOF", // <-- LA CLÉ : Définir la devise en Franc CFA Ouest-Africain
            product_data: {
              name: eventTitle, // Nom de l'événement affiché sur la page de paiement
              // description: `Billet(s) pour l'événement ${eventTitle}`, // Optionnel : description plus détaillée
              // images: ['https://votre-domaine.com/images/event.jpg'], // Optionnel : URL d'image du produit
            },
            unit_amount: amountInCFA, // <-- Le prix unitaire en CFA (entier)
          },
          quantity, // La quantité de billets
        },
      ],
      // --- 4. URLs de redirection après le paiement ---
      // Ces URLs doivent être accessibles publiquement.
      // process.env.NEXT_PUBLIC_APP_URL doit être défini dans votre .env.local
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/event/${eventId}?canceled=true`,
      // --- 5. Métadonnées (informations personnalisées) ---
      // Ces données sont stockées avec la session Stripe et sont utiles pour le suivi
      // et la mise à jour de votre base de données via les webhooks.
      metadata: {
        userId: userId,
        eventId: eventId,
        quantity: quantity,
      },
    });

    // --- 6. Retourne l'URL de la session Stripe au frontend ---
    // Le frontend (EventBookingSidebar) utilisera cette URL pour rediriger l'utilisateur.
    return NextResponse.json({ url: session.url });

  } catch (error) {
    // --- 7. Gestion des erreurs ---
    console.error("Erreur lors de la création de la session Stripe:", error);
    return new NextResponse("Erreur interne du serveur lors de la création de la session de paiement.", { status: 500 });
  }
}