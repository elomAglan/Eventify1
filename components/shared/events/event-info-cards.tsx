import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, Banknote } from "lucide-react"; // Importation de Banknote à la place de DollarSign

export function EventInfoCards({
  date,
  location,
  tickets,
  price,
}: {
  date: string | Date;
  location?: string;
  tickets: number;
  price: number;
}) {

  // Fonction pour formater le prix en CFA
  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-TG', { // 'fr-TG' pour le Togo, utilisant le XOF
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatte la date pour l'affichage en français
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Carte "Date de l'événement" */}
      <Card className="p-0 dark:bg-gray-850 dark:border-gray-700">
        <CardContent className="p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Date de l'événement</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}</p>
          </div>
        </CardContent>
      </Card>

      {/* Carte "Lieu" */}
      <Card className="p-0 dark:bg-gray-850 dark:border-gray-700">
        <CardContent className="p-4 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Lieu</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{location || "Non spécifié"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Carte "Billets disponibles" */}
      <Card className="p-0 dark:bg-gray-850 dark:border-gray-700">
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Billets disponibles</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{tickets} restants</p>
          </div>
        </CardContent>
      </Card>

      {/* Carte "Prix par billet" */}
      <Card className="p-0 dark:bg-gray-850 dark:border-gray-700">
        <CardContent className="p-4 flex items-center gap-3">
          <Banknote className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {/* Icône Banknote */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Prix par billet</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatCFA(price)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}