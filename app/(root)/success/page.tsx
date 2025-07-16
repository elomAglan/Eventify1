"use client";

import { CheckCircle2, Download, Printer } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming these are your Shadcn UI components
import { Button } from "@/components/ui/button"; // Assuming this is your Shadcn UI Button
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner"; // Assuming Sonner for toasts
import QRCode from "react-qr-code"; // Assuming react-qr-code
import html2canvas from "html2canvas"; // Ensure these are installed: npm install html2canvas jspdf
import jsPDF from "jspdf";

// Type definitions for better type safety
interface PaymentDetails {
  eventTitle: string;
  quantity: number;
  totalAmount: number; // This will hold the amount in minor units as received from Stripe
  transactionId: string;
  userId: string;
}

// Receipt Component (sub-component for clarity and reusability)
const ReceiptComponent = ({
  eventTitle,
  quantity,
  totalAmountCFA, // This prop now expects the already formatted string
  transactionId,
  receiptLink,
  userId,
}: {
  eventTitle: string;
  quantity: number;
  totalAmountCFA: string;
  transactionId: string;
  receiptLink: string;
  userId: string;
}) => {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    // Applied custom Tailwind colors for consistency
    <div className="p-6 bg-card text-card-foreground border border-border rounded-lg shadow-sm print:shadow-none">
      <h3 className="text-xl font-bold text-foreground mb-4 text-center">
        Reçu de Commande
      </h3>
      <div className="space-y-2 text-muted-foreground">
        <p>
          <strong>Événement :</strong> {eventTitle}
        </p>
        <p>
          <strong>Quantité :</strong> {quantity} billet(s)
        </p>
        <p>
          <strong>Montant Total :</strong> {totalAmountCFA}
        </p>
        <p>
          <strong>ID de Transaction :</strong> {transactionId}
        </p>
        <p>
          <strong>Date de la Commande :</strong> {currentDate}
        </p>
        <p>
          <strong>Client ID :</strong> {userId}
        </p>
      </div>

      <div className="flex justify-center my-6">
        {receiptLink && (
          <div className="p-2 border border-border rounded">
            <QRCode value={receiptLink} size={128} level="H" />
          </div>
        )}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Scannez le QR code pour une vérification rapide.
      </p>
    </div>
  );
};

// Main Success Page Component
export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Formats currency for XOF (CFA Franc)
  const formatCFA = useCallback((amount: number) => {
    // --- CORRECTION APPLIQUÉE ICI ---
    // Pour le Franc CFA (XOF), Stripe fournit déjà le montant dans l'unité principale.
    // PAS BESOIN de diviser par 100 comme pour EUR/USD ou d'autres devises avec des sous-unités classiques.
    const actualAmount = amount; // <-- Suppression de la division par 100

    return new Intl.NumberFormat("fr-TG", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // XOF typically has no decimal places in practice
    }).format(actualAmount);
  }, []);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        toast.error("ID de session manquant.");
        return;
      }

      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const data = await res.json();

        if (res.ok && data.session && data.paymentIntent) {
          setPaymentDetails({
            eventTitle:
              data.session.line_items.data[0]?.description ||
              "Événement inconnu",
            quantity: data.session.line_items.data[0]?.quantity || 1,
            totalAmount: data.paymentIntent.amount, // Amount is in minor units (e.g., cents for USD/EUR, but in actual value for XOF)
            transactionId: data.paymentIntent.id,
            userId: data.session.metadata?.userId || "N/A",
          });
        } else {
          toast.error(
            data.error || "Impossible de récupérer les détails de la session."
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de la session:",
          error
        );
        toast.error("Une erreur est survenue lors du chargement des détails.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  // --- Print Function ---
  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "height=600,width=800");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Votre Reçu</title>");

        // Copy all stylesheets from the current document to the print window
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
        stylesheets.forEach(sheet => {
          printWindow.document.head.appendChild(sheet.cloneNode(true));
        });

        printWindow.document.write("</head><body>");
        printWindow.document.write(receiptRef.current.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }
    }
  };

  // --- Download PDF Function ---
  const handleDownloadPdf = async () => {
    if (!receiptRef.current) {
      toast.error("Le reçu n'est pas disponible pour le téléchargement.");
      return;
    }
    setLoading(true); // Set loading true for PDF generation
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 }); // Scale for better resolution
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`reçu-tickevent-${paymentDetails?.transactionId || "N/A"}.pdf`);
      toast.success("Reçu téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Échec du téléchargement du reçu PDF.");
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <p className="text-xl text-foreground">
          Chargement des détails du paiement...
        </p>
      </div>
    );
  }

  // --- Error State (No Payment Details) ---
  if (!paymentDetails) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-card text-card-foreground border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-destructive">
              Erreur !
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Une erreur est survenue ou les détails du paiement n'ont pas pu
              être trouvés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure NEXT_PUBLIC_APP_URL is defined in your .env file
  // Example in .env.local: NEXT_PUBLIC_APP_URL=http://localhost:3000
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const qrCodeLink = appUrl
    ? `${appUrl}/tickets/${paymentDetails.transactionId}`
    : `Lien non disponible`; // Fallback if env var is missing

  // --- Success State (Payment Details Loaded) ---
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md bg-card text-card-foreground border border-border">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto text-green-500 w-16 h-16 mb-2" />
          <CardTitle className="text-2xl font-bold text-foreground">
            Paiement Réussi !
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Votre action a été complétée avec succès.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-foreground">
            Merci d'avoir utilisé TickEvent pour vos billets. Un reçu détaillé
            est disponible ci-dessous.
          </p>

          <div ref={receiptRef}>
            <ReceiptComponent
              eventTitle={paymentDetails.eventTitle}
              quantity={paymentDetails.quantity}
              totalAmountCFA={formatCFA(paymentDetails.totalAmount)} // Pass the formatted amount
              transactionId={paymentDetails.transactionId}
              receiptLink={qrCodeLink}
              userId={paymentDetails.userId}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Printer className="w-4 h-4 mr-2" /> Imprimer le reçu
            </Button>
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="w-4 h-4 mr-2" /> Télécharger le reçu (PDF)
            </Button>
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/dashboard">Aller au Tableau de bord</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}