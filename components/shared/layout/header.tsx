import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import UserDropdown from "../user/user-dropdown";
import {
  Menu,
  Home,
  CalendarDays,
  PlusCircle,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Sparkles, // Icône pour le logo Eventify
} from "lucide-react"; // Importez toutes les icônes nécessaires
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between h-16">
        {/* Logo Eventify avec icône */}
        <Link
          href="/"
          className="flex items-center gap-2 text-3xl font-extrabold text-blue-600 hover:text-blue-700 transition-colors duration-200 tracking-tight dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Sparkles className="h-8 w-8 text-blue-500" /> {/* Icône Sparkles */}
          Eventify
        </Link>

        {/* Navigation principale pour écrans moyens et plus grands */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <Home className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            Accueil
          </Link>
          <Link
            href="/events"
            className="group flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <CalendarDays className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            Événements
          </Link>
          {session && (
            <>
              <Link
                href="/create-event"
                className="group flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <PlusCircle className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                Créer un événement
              </Link>
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <LayoutDashboard className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                Tableau de Bord
              </Link>
            </>
          )}
        </nav>

        {/* Boutons d'action ou UserDropdown */}
        <div className="flex items-center space-x-3">
          {session ? (
            <UserDropdown />
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 font-medium rounded-lg transition-colors duration-200"
                >
                  <LogIn className="h-5 w-5" />
                  Se connecter
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 shadow-md transition-colors duration-200 rounded-lg">
                  <UserPlus className="h-5 w-5" />
                  S'inscrire
                </Button>
              </Link>
            </>
          )}

          {/* Bouton Hamburger pour mobile */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Menu className="h-7 w-7" /> {/* Icône plus grande */}
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 p-6 flex flex-col">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3 border-gray-200 dark:border-gray-700">
                  Navigation
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Menu de navigation principal du site Eventify.
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col space-y-5 flex-grow"> {/* Ajout de flex-grow */}
                <Link
                  href="/"
                  className="group flex items-center gap-4 text-xl font-semibold text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <Home className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  Accueil
                </Link>
                <Link
                  href="/events"
                  className="group flex items-center gap-4 text-xl font-semibold text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <CalendarDays className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  Événements
                </Link>
                {session && (
                  <>
                    <Link
                      href="/create-event"
                      className="group flex items-center gap-4 text-xl font-semibold text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <PlusCircle className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
                      Créer un événement
                    </Link>
                    <Link
                      href="/dashboard"
                      className="group flex items-center gap-4 text-xl font-semibold text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <LayoutDashboard className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
                      Mon Tableau de Bord
                    </Link>
                  </>
                )}
              </nav>

              {!session && (
                <div className="flex flex-col space-y-4 mt-auto pt-6 border-t border-gray-200 dark:border-gray-700"> {/* mt-auto pour pousser en bas */}
                  <Link href="/sign-in">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg rounded-lg shadow-md flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-blue-600 font-semibold py-3 text-lg rounded-lg shadow-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400 flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}