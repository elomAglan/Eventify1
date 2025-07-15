"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from 'date-fns/locale'; // Importez la locale française
import { CalendarIcon, Image as ImageIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createEventSchema } from "@/lib/validations";
import { uploadToImageKit } from "@/lib/actions/upload";
import { toast } from "sonner";
import { createEventAction } from "@/lib/actions/event";
import { useRouter } from "next/navigation";

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export function CreateEventForm() {
  const router = useRouter();
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      tickets: 1,
      price: 0,
      date: undefined,
      location: "",
      featuredImage: undefined,
      additionalImages: undefined,
    },
  });

  const [featuredImageName, setFeaturedImageName] = useState<string | null>(
    null
  );
  const [additionalImagesCount, setAdditionalImagesCount] = useState<number>(0);

  const onSubmit = async (data: CreateEventFormValues) => {
    let featuredImageUrl: string | undefined = undefined;
    let additionalImageUrls: string[] = [];

    if (data.featuredImage instanceof File) {
      featuredImageUrl = await uploadToImageKit(data.featuredImage);
    }

    if (data.additionalImages && data.additionalImages.length > 0) {
      const files = Array.from(data.additionalImages as FileList);
      additionalImageUrls = await Promise.all(
        files.map((file) => uploadToImageKit(file))
      );
    }

    try {
      const response = await createEventAction({
        ...data,
        featuredImageUrl,
        additionalImageUrls,
      });
      if (response.success === false) {
        toast.error(response.message);
        return;
      }
      toast.success("Événement créé avec succès !");
      router.push(`/dashboard`);
    } catch (error) {
      console.log(error);
      toast.error("Échec de la création de l'événement. Veuillez réessayer.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Détails de l'événement
        </h2>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Titre de l'événement</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Concert de Jazz en Plein Air" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre événement en quelques lignes..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Nombre de billets disponibles</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Prix du billet (CFA)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="15000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-semibold text-gray-700">Date de l'événement</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 text-base",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {field.value ? (
                      // Utilisez la locale 'fr' ici
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    // Passez la locale 'fr' au composant Calendar
                    locale={fr}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Lieu de l'événement (Facultatif)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Stade de Kégué, Lomé" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Image principale de l'événement</FormLabel>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    id="featured-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      setFeaturedImageName(file ? file.name : null);
                    }}
                  />
                  <label
                    htmlFor="featured-image-upload"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 hover:border-blue-500 transition-colors cursor-pointer text-center"
                  >
                    <ImageIcon className="h-14 w-14 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      {featuredImageName
                        ? featuredImageName
                        : "Cliquez ou glissez-déposez pour ajouter l'image principale"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Fichiers pris en charge : PNG, JPG, WebP (max 10 Mo)
                    </p>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Images additionnelles (Facultatif)</FormLabel>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                    id="additional-images-upload"
                    onChange={(e) => {
                      const files = e.target.files;
                      field.onChange(files);
                      setAdditionalImagesCount(files ? files.length : 0);
                    }}
                  />
                  <label
                    htmlFor="additional-images-upload"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 hover:border-blue-500 transition-colors cursor-pointer text-center"
                  >
                    <ImageIcon className="h-14 w-14 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      {additionalImagesCount > 0
                        ? `${additionalImagesCount} image(s) sélectionnée(s)`
                        : "Cliquez ou glissez-déposez pour ajouter des images additionnelles"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Plusieurs images autorisées (PNG, JPG, WebP)
                    </p>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Création de l'événement..." : "Créer l'événement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}