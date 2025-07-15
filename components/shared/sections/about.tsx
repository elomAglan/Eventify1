export function About() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            À propos d'<span className="text-blue-600 dark:text-blue-400">Eventify</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Eventify est votre destination de choix pour découvrir et participer à des événements incroyables.
            Notre mission est de connecter les organisateurs d'événements avec des participants enthousiastes,
            créant ainsi des expériences mémorables qui rassemblent les communautés.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {/* Carte de fonctionnalité 1: Réservation Facile */}
          <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600">
            <div className="w-20 h-20 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <span className="text-white text-4xl">🎟️</span> {/* Emoji pour billet */}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Réservation Facile</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Profitez d'un processus de réservation de billets simple, rapide et entièrement sécurisé sur Eventify.
            </p>
          </div>

          {/* Carte de fonctionnalité 2: Événements de Qualité */}
          <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600">
            <div className="w-20 h-20 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <span className="text-white text-4xl">✨</span> {/* Emoji pour étoile/qualité */}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Événements de Qualité</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Découvrez une sélection rigoureuse d'événements de premier choix, garantissant des expériences inoubliables.
            </p>
          </div>

          {/* Carte de fonctionnalité 3: Communauté */}
          <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600">
            <div className="w-20 h-20 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <span className="text-white text-4xl">🤝</span> {/* Emoji pour poignée de main/communauté */}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Communauté</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Favorisez les connexions et le partage d'expériences uniques au sein de notre communauté grandissante sur Eventify.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
