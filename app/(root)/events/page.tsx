import { EventCard } from "@/components/shared/events/event-card";
import { EventsSearch } from "@/components/shared/events/events-search";
import { getEventsAction } from "@/lib/actions/event";
import { EventWithImages } from "@/types";
import { Metadata } from "next";

// Génération des métadonnées pour la page (titre et description SEO)
export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Tous les événements | Eventify", // Titre de la page mis à jour
  description:
    "Découvrez tous les événements à venir sur Eventify. Recherchez par mot-clé et trouvez votre prochaine expérience mémorable.", // Description mise à jour
});

// Définition des props pour la page, incluant les paramètres de recherche
interface EventsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

// Composant principal de la page d'événements
export default async function EventsPage({ searchParams }: EventsPageProps) {
  const currSearchParams = await searchParams;
  // Récupération du terme de recherche depuis les paramètres d'URL
  const query = currSearchParams.query || "";
  // Récupération de tous les événements filtrés par la recherche
  const allEvents: EventWithImages[] = await getEventsAction(query);

  return (
    <div className="flex-1 py-8 bg-gray-50"> {/* Ajout d'un léger fond pour améliorer l'UI */}
      <div className="container mx-auto px-4 md:px-8"> {/* Padding ajusté */}
        <div className="mb-8 text-center"> {/* Centrage du titre et de la barre de recherche */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Découvrez les Événements sur <strong>Eventify</strong>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Explorez une multitude d'expériences uniques près de chez vous.
          </p>
          <div className="max-w-xl mx-auto"> {/* Centrage et limitation de la largeur de la barre de recherche */}
            <EventsSearch />
          </div>
        </div>

        {/* Message si aucun événement n'est trouvé */}
        {allEvents.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-lg">
            <p>Aucun événement trouvé pour votre recherche.</p>
            <p>Essayez un autre mot-clé ou parcourez notre sélection.</p>
          </div>
        )}

        {/* Grille d'affichage des cartes d'événements */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Grille plus flexible */}
          {allEvents.map((event: EventWithImages) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}