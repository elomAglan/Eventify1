import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Facebook,
  Twitter,
  Instagram,
  Home,
  CalendarDays,
  Gauge, // Icône pour le tableau de bord
  PlusCircle, // Icône pour créer un événement
  LogIn, // Icône pour se connecter
  UserPlus, // Icône pour s'inscrire
  Mail,
  Phone,
  MapPin,
} from "lucide-react"; // Importez les icônes de Lucide React

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isLoggedIn = !!session;

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-16 dark:from-gray-950 dark:to-gray-850">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 border-b border-gray-700/50 pb-12 mb-12">

          {/* Section Logo et Description */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col items-start">
            <h3 className="text-4xl font-extrabold text-blue-400 mb-4 tracking-tighter drop-shadow-md">
              Eventify
            </h3>
            <p className="text-gray-400 max-w-sm leading-relaxed text-md">
              Connectez-vous à des moments inoubliables. Votre porte d'entrée vers des événements uniques et des expériences mémorables.
            </p>
          </div>

          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2 inline-block">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 text-lg group"
                >
                  <Home className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 text-lg group"
                >
                  <CalendarDays className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  Tous les événements
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 text-lg group"
                    >
                      <Gauge className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                      Mon Tableau de Bord
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create-event"
                      className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 text-lg group"
                    >
                      <PlusCircle className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                      Créer un événement
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/sign-in"
                      className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 text-lg group"
                    >
                      <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                      Se connecter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 text-lg group"
                    >
                      <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                      S'inscrire
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Section Suivez-nous */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2 inline-block">Suivez-nous</h4>
            <div className="flex space-x-6">
              <a
                href="#" // Remplacez par votre lien Facebook réel
                className="text-gray-400 hover:text-blue-400 transition-colors text-3xl"
                aria-label="Facebook"
              >
                <Facebook className="h-8 w-8" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#" // Remplacez par votre lien Twitter réel
                className="text-gray-400 hover:text-blue-400 transition-colors text-3xl"
                aria-label="Twitter"
              >
                <Twitter className="h-8 w-8" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#" // Remplacez par votre lien Instagram réel
                className="text-gray-400 hover:text-blue-400 transition-colors text-3xl"
                aria-label="Instagram"
              >
                <Instagram className="h-8 w-8" />
                <span className="sr-only">Instagram</span>
              </a>
              {/* Ajoutez d'autres liens sociaux ici */}
            </div>
            <p className="mt-6 text-gray-400 text-md">
              Restons connectés pour ne rien manquer de nos actualités !
            </p>
          </div>

          {/* Section Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-6 border-b-2 border-blue-500 pb-2 inline-block">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-lg">
                <Mail className="h-5 w-5 text-blue-500 mt-1" />{" "}
                <a href="mailto:contact@eventify.com" className="hover:text-blue-400 transition-colors">
                  contact@eventify.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <Phone className="h-5 w-5 text-blue-500 mt-1" />{" "}
                <a href="tel:+15551234567" className="hover:text-blue-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <MapPin className="h-5 w-5 text-blue-500 mt-1" />{" "}
                <address className="not-italic text-gray-400">
                  123 Rue des Événements, Ville, Pays
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Droits d'auteur et crédits */}
        <div className="text-center pt-8">
          <p className="text-gray-400 text-sm">
            © {currentYear} Eventify. Tous droits réservés. Construit avec{" "}
            <span className="text-red-500" role="img" aria-label="amour">
              ❤️
            </span>{" "}
            par{" "}
            <a
              href="https://portfolio-aglan.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium"
            >
              ORGUEZY
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}