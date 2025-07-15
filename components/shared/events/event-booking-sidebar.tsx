"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function EventBookingSidebar({
  price,
  tickets, // Nombre total de tickets disponibles pour l'événement
  eventId,
  userId,
  eventTitle,
  eventDate,
}: {
  price: number;
  tickets: number;
  eventId: string;
  userId: string;
  eventTitle: string;
  eventDate: Date;
}) {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  // Vérifie si la date de l'événement est passée
  // La date actuelle est le 14 juillet 2025 à 11:50:11 AM GMT.
  const hasEventFinished = new Date(eventDate) < new Date();

  const handleCheckout = async () => {
    try {
      if (hasEventFinished) {
        toast.error("Vous ne pouvez pas acheter de billets pour un événement déjà terminé.");
        return;
      }
      if (!userId) { // Vérifie si userId est vide (utilisateur non connecté)
        toast.error("Vous devez être connecté(e) pour acheter des billets.");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          quantity: ticketQuantity,
          price, // Le prix doit être envoyé au backend dans la devise attendue par votre API de paiement (souvent en centimes/units)
          eventTitle,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error("Échec de la création de la session de paiement.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue lors du traitement de votre demande.");
      console.error("Erreur de paiement :", err);
    }
  };

  const formatCFA = (amount: number) => {
    // Formatte le montant en CFA. Les francs CFA n'ont pas de décimales.
    return new Intl.NumberFormat('fr-TG', { // 'fr-TG' pour le Togo, qui utilise le XOF (CFA Ouest-Africain)
      style: 'currency',
      currency: 'XOF', // Code ISO pour le Franc CFA Ouest-Africain
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8 bg-white dark:bg-gray-850 dark:border-gray-700 shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm text-center dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-200">
            <strong>Mode Test :</strong> <br />
            <span>N'utilisez pas votre vraie carte. Ceci est un environnement de démonstration.</span>
            <br />
            Utilisez la carte <span className="font-mono">4242 4242 4242 4242</span>,
            date <span className="font-mono">12/34</span>, CVC{" "}
            <span className="font-mono">123</span> pour tester les paiements.
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2 dark:text-blue-400">
              {formatCFA(price)} {/* Affichage du prix en CFA */}
            </div>
            <p className="text-gray-600 dark:text-gray-400">par billet</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Nombre de billets
              </label>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTicketQuantity(Math.max(1, ticketQuantity - 1))
                  }
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  disabled={hasEventFinished} // Désactive les boutons si événement terminé
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-8 text-center text-gray-900 dark:text-gray-100">
                  {ticketQuantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTicketQuantity(Math.min(10, ticketQuantity + 1))
                  }
                  disabled={ticketQuantity >= tickets || ticketQuantity >= 10 || hasEventFinished} // Désactive si max atteint ou événement terminé
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                <span>
                  Sous-total ({ticketQuantity} billet
                  {ticketQuantity > 1 ? "s" : ""})
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatCFA(price * ticketQuantity)} {/* Affichage du sous-total en CFA */}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2 dark:text-gray-400">
                <span>Frais de service</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatCFA(0)} {/* Frais de service en CFA */}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span className="text-green-600 dark:text-green-400">
                  {formatCFA(price * ticketQuantity)} {/* Affichage du total en CFA */}
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 dark:bg-blue-700 dark:hover:bg-blue-600"
              onClick={handleCheckout}
              disabled={hasEventFinished} // Désactive le bouton si l'événement est terminé
            >
              {hasEventFinished ? "Événement terminé" : "Acheter les billets"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}