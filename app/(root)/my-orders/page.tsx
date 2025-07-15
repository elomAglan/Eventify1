import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderByUserIdAction } from "@/lib/actions/order";

export default async function MyOrdersPage() {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Récupération des commandes de l'utilisateur
  const orders = await getOrderByUserIdAction(session.user.id);

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Mes Commandes</h1>

        {/* Affichage conditionnel : si aucune commande ou liste des commandes */}
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Vous n'avez pas encore passé de commandes.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Explorez nos événements et trouvez votre prochaine sortie !
            </p>
          </div>
        ) : (
          <div className="space-y-6"> {/* Espacement légèrement augmenté */}
            {orders.map((order) => (
              <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-850 dark:border-gray-700">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 rounded-t-lg border-b dark:border-gray-700">
                  <CardTitle className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    {order.event?.title || "Événement inconnu"} {/* Texte plus descriptif */}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4"> {/* Espacement ajusté */}
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600 dark:text-gray-400">Quantité :</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600 dark:text-gray-400">Montant total :</span>
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600 dark:text-gray-400">Statut du paiement :</span>
                    <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'} {/* Traduction */}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600 dark:text-gray-400">Commandé le :</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {new Date(order.createdAt).toLocaleString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}