"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client"; // Utilisation de authClient spécifique
import Link from "next/link";
import { LogOut, LayoutDashboard, CalendarPlus, Info } from "lucide-react";
import { getUserInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const UserDropdown = () => {
  const router = useRouter();
  // On déstructure 'data' (renommée en session) et 'isPending' de l'objet retourné par useSession
  const { data: session, isPending } = authClient.useSession();

  // Si la session est en cours de chargement, on ne rend rien ou un skeleton
  if (isPending) {
    return null; // Ou un composant de chargement léger
  }

  // Si la session n'existe pas ou que l'objet utilisateur est manquant après le chargement,
  // ce composant ne doit pas être rendu. Le composant parent (Header) gérera l'affichage
  // des boutons de connexion/inscription dans ce cas.
  if (!session?.user) {
    return null;
  }

  const userInitials = getUserInitials(session.user.name);
  const avatarUrl = `https://avatar.vercel.sh/${userInitials}.svg?text=${userInitials}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={`Avatar de l'utilisateur`} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-gray-900 dark:text-gray-100">{session.user.name}</p>
            <p className="w-[200px] truncate text-sm text-gray-600 dark:text-gray-400">
              {session.user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />

        <DropdownMenuItem asChild className="hover:bg-gray-50 dark:hover:bg-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Tableau de Bord
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="hover:bg-gray-50 dark:hover:bg-gray-700">
          <Link
            href="/create-event"
            className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Créer un Événement
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="hover:bg-gray-50 dark:hover:bg-gray-700">
          <Link
            href="/my-orders"
            className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <Info className="mr-2 h-4 w-4" />
            Mes Commandes
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />

        <DropdownMenuItem
          className="flex items-center text-red-600 focus:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/sign-in");
                },
              },
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          Se Déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;