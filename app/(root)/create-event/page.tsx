import { CreateEventForm } from "@/components/shared/forms/create-event-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateEventPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <div className="flex-1 py-12 px-4 md:px-8 lg:px-16 bg-gray-50"> {/* Ajout de padding et un fond léger */}
      <div className="mx-auto max-w-4xl lg:max-w-5xl"> {/* Augmentation de la largeur maximale */}
        <Card className="shadow-lg border-none rounded-xl overflow-hidden"> {/* Styles pour une carte plus moderne */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 sm:p-8 text-white"> {/* En-tête avec dégradé et padding amélioré */}
            <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center mb-2">
              Lancez Votre Événement sur <strong>Eventify</strong> !
            </CardTitle>
            <CardDescription className="text-lg text-blue-100 text-center max-w-xl mx-auto">
              Remplissez ce formulaire simple pour donner vie à votre prochain événement et atteindre votre public idéal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8"> {/* Padding pour le contenu */}
            <CreateEventForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}