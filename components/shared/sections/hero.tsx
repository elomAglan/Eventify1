"use client"; // N'oubliez pas cette directive en haut du fichier, car le composant utilise des Hooks React comme useState et useEffect.

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react"; // Importez useState et useEffect pour gérer l'état et les effets de côté.

export function Hero() {
  // Tableau des URLs de vos images d'arrière-plan.
  // Ces images doivent être placées directement dans le dossier 'public'
  // ou dans un sous-dossier de 'public' (par exemple, 'public/images/').
  // Si elles sont dans 'public/images/', utilisez "/images/img1.jpg", etc.
  const backgroundImages = [
    "/img3.jpg", // Assurez-vous que img3.jpg est directement dans le dossier public.
    "/img2.jpg", // Assurez-vous que img2.jpg est directement dans le dossier public.
    "/img1.jpg", // Assurez-vous que img1.jpg est directement dans le dossier public.
  ];

  // État local pour suivre l'index de l'image actuellement affichée.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Utilisation de useEffect pour gérer la transition automatique des images.
  useEffect(() => {
    // Configure un intervalle pour changer l'image toutes les 5 secondes (5000 ms).
    const interval = setInterval(() => {
      // Met à jour l'index de l'image, en revenant au début du tableau une fois la fin atteinte.
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change l'image toutes les 5 secondes.

    // Fonction de nettoyage : s'exécute lorsque le composant est démonté ou avant que l'effet ne soit ré-exécuté.
    // Cela empêche les fuites de mémoire.
    return () => clearInterval(interval);
  }, [backgroundImages.length]); // Le Hook se ré-exécute si la longueur du tableau d'images change.

  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Conteneur pour les images d'arrière-plan */}
      <div className="absolute inset-0 w-full h-full">
        {backgroundImages.map((imageUrl, index) => (
          <img
            key={index} // La clé est importante pour les listes d'éléments React.
            src={imageUrl} // Chemin de l'image.
            alt={`Image d'arrière-plan ${index + 1}`} // Texte alternatif pour l'accessibilité.
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
              ${index === currentImageIndex ? "opacity-100" : "opacity-0"}
            `}
            // Fallback pour les images si elles ne chargent pas.
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/1920x1080/000000/FFFFFF?text=Image+Introuvable";
              console.error(`Échec du chargement de l'image : ${imageUrl}`); // Log l'erreur pour le débogage.
            }}
          />
        ))}
        {/* Superposition sombre pour améliorer la lisibilité du texte sur les images. */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Contenu de la Section Hero (texte et boutons), positionné au-dessus des images. */}
      <div className="container mx-auto px-4 text-center relative z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Découvrez des événements incroyables
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto drop-shadow-md">
          {
            "Trouvez et réservez des billets pour les meilleurs événements de votre ville. Des concerts aux conférences, nous avons ce qu'il vous faut."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Parcourir les événements
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}