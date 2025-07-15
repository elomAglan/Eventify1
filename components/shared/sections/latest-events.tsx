import { EventCard } from "@/components/shared/events/event-card";
import { EventsSearch } from "@/components/shared/events/events-search";
import { getEventsAction } from "@/lib/actions/event";
import { EventWithImages } from "@/types";

// Correction du type de searchParams pour inclure string[]
interface LatestEventsProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function LatestEvents({ searchParams }: LatestEventsProps) {
  // Récupère le terme de recherche des searchParams.
  // Gère le cas où 'query' pourrait être un tableau.
  const query = Array.isArray(searchParams?.query) 
    ? searchParams.query[0] // Prend le premier élément si c'est un tableau
    : searchParams?.query || ""; 

  // Récupère les événements en utilisant getEventsAction avec le terme de recherche
  const events: EventWithImages[] = await getEventsAction(query);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tous les événements
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Découvrez tous les événements disponibles sur Eventify.
          </p>
          <EventsSearch />
        </div>

        {events.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            <p>Aucun événement trouvé pour le moment.</p>
            {query && <p>Affinez votre recherche ou essayez un autre terme.</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {events.map((event: EventWithImages) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
