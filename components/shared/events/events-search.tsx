"use client"; // Indique que ce composant est un Client Component

import { Input } from "@/components/ui/input"; // Composant Input de Shadcn UI
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url"; // Fonctions utilitaires pour manipuler les URL
import { Search } from "lucide-react"; // Icône de recherche
import { useRouter, useSearchParams } from "next/navigation"; // Hooks de Next.js pour la navigation et les paramètres d'URL
import { useEffect, useState } from "react"; // Hooks React pour l'état et les effets secondaires

export function EventsSearch() {
  const searchParams = useSearchParams(); // Permet de lire les paramètres d'URL actuels
  const query = searchParams.get("query") || ""; // Récupère le paramètre 'query' de l'URL, ou une chaîne vide
  const [searchTerm, setSearchTerm] = useState(query); // État local pour le terme de recherche dans l'input
  const router = useRouter(); // Permet de manipuler la navigation de Next.js

  // Effet qui se déclenche lorsque 'searchTerm', 'router' ou 'searchParams' changent
  useEffect(() => {
    // Met en place un délai (debounce) pour éviter de déclencher la recherche à chaque frappe
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (searchTerm) {
        // Si un terme de recherche existe, ajoute-le ou met-le à jour dans l'URL
        newUrl = formUrlQuery({
          params: searchParams.toString(), // Paramètres d'URL actuels
          key: "query", // Clé du paramètre à ajouter/modifier
          value: searchTerm, // Nouvelle valeur du terme de recherche
        });
      } else {
        // Si le terme de recherche est vide, supprime le paramètre 'query' de l'URL
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"], // Clé du paramètre à supprimer
        });
      }
      // Pousse la nouvelle URL sans faire défiler la page
      router.push(newUrl, { scroll: false });
    }, 1000); // Délai de 1 seconde

    // Fonction de nettoyage : annule le timeout si le composant est démonté ou si la dépendance change avant la fin du délai
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]); // Dépendances de l'effet

  return (
    <div className="relative max-w-md">
      {/* Icône de recherche positionnée à l'intérieur de l'input */}
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" /> {/* Ajustement pour le mode sombre */}
      {/* Champ de saisie pour la recherche d'événements */}
      <Input
        placeholder="Rechercher des événements..." // Texte du placeholder traduit
        className="pl-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:dark:border-blue-500" // Ajustements pour le mode sombre
        value={searchTerm} // La valeur de l'input est liée à l'état local
        onChange={(e) => setSearchTerm(e.target.value)} // Met à jour l'état quand l'utilisateur tape
      />
    </div>
  );
}