import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// Nous allons définir notre propre fonction de formatage de date ici,
// ou s'assurer que "@/lib/utils" formatDate est compatible avec les locales.
// Pour cet exemple, nous allons la définir localement pour s'assurer du bon fonctionnement.
// import { formatDate } from "@/lib/utils";
import { EventTypes } from "@/types";
import { Calendar } from "lucide-react"; // Icône calendrier
import Image from "next/image"; // Composant Next.js pour l'optimisation des images
import Link from "next/link"; // Composant Next.js pour la navigation

interface EventCardProps {
  event: EventTypes;
  showBookButton?: boolean; // Optionnel : affiche ou masque le bouton "Voir les détails"
}

export function EventCard({ event, showBookButton = true }: EventCardProps) {
  // Image par défaut si aucune image n'est fournie pour l'événement
  const defaultEventImage = "https://ik.imagekit.io/dr6ajzqv4/default-event.png";

  // Fonction pour formater le prix en CFA (répétée pour la clarté si elle n'est pas globale)
  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-TG', { // 'fr-TG' pour le Togo, utilisant le XOF
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // NOUVELLE FONCTION DE FORMATAGE DE DATE POUR LE FRANÇAIS
  const formatEventDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // Vous pouvez ajouter l'heure si vous voulez:
      // hour: '2-digit',
      // minute: '2-digit',
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 p-0 dark:bg-gray-850 dark:border-gray-700"> {/* Amélioration des styles pour le survol et le mode sombre */}
      <div className="aspect-video relative overflow-hidden">
        {/* Image de l'événement */}
        <Image
          src={event.featuredImage ? (event.featuredImage as string) : defaultEventImage}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" // Effet de zoom au survol
          fill // Remplit le conteneur parent
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimisation des images pour différentes tailles d'écran
        />
      </div>
      <CardContent className="p-6"> {/* Padding ajusté pour un meilleur espacement */}
        {/* Titre de l'événement */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
          {event.title}
        </h3>
        {/* Date de l'événement */}
        <div className="flex items-center text-gray-600 mb-2 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" /> {/* Icône calendrier */}
          <span className="text-sm">
            {/* UTILISATION DE LA NOUVELLE FONCTION formatEventDate */}
            {formatEventDate(event.date)}
          </span>
        </div>
        {/* Lieu de l'événement (si disponible) */}
        {event.location && (
          <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">{event.location}</p>
        )}
        {/* Prix de l'événement */}
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCFA(event.price)} {/* Affichage du prix en CFA */}
        </div>
      </CardContent>
      {/* Bouton "Voir les détails" si showBookButton est vrai */}
      {showBookButton && (
        <CardFooter className="px-6 pb-6 pt-0"> {/* Padding ajusté */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-2 dark:bg-blue-700 dark:hover:bg-blue-600" asChild>
            <Link
              href={`/event/${event.id}`}
              className="flex items-center justify-center text-white font-medium"
            >
              Voir les détails
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}