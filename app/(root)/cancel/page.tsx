import { XCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CancelPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");
  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="mx-auto text-red-500 w-16 h-16 mb-2" />
          <CardTitle className="text-2xl font-bold">Paiement Annulé</CardTitle>
          <CardDescription>Votre paiement n'a pas été finalisé.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">
            Vous avez annulé le processus de paiement sur <strong>Eventify</strong>.
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard">Retour au Tableau de Bord</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}