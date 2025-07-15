import { Card, CardContent } from "@/components/ui/card";

export function EventDescription({ description }: { description: string }) {
  return (
    <Card className="p-0 dark:bg-gray-850 dark:border-gray-700"> {/* Ajusté pour le mode sombre */}
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          À propos de cet événement
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line dark:text-gray-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}