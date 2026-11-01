import { BadgeCheck, Ban, CheckCircle2, FileText, QrCode } from "lucide-react";
import { organization } from "@/lib/organization";

export const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#results", label: "What you'll see" },
  { href: "#contact", label: "Contact" },
];

export const steps = [
  {
    icon: FileText,
    title: "Find the code",
    description: "Every certificate carries a unique code and a QR code, printed together.",
  },
  {
    icon: QrCode,
    title: "Scan or enter it",
    description: "Scan the QR code with a phone camera, or type the code into the box at the top of this page.",
  },
  {
    icon: BadgeCheck,
    title: "Read the result",
    description: `We check it against ${organization.name}'s records and show who it was issued to and whether it is still valid.`,
  },
];

export const results = [
  {
    icon: QrCode,
    title: "Printed with a QR code",
    description: `Every ${organization.name} certificate has a unique code and a QR code printed on it. Scan it with a phone camera to check it.`,
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: CheckCircle2,
    title: "Valid",
    description: "The certificate is genuine. You'll see the recipient, the course, and the date it was issued.",
    tone: "bg-success/10 text-success",
  },
  {
    icon: Ban,
    title: "Not valid",
    description: `${organization.name} has withdrawn the certificate, or no certificate matches the code. Don't accept it, and contact us if you think it's a mistake.`,
    tone: "bg-destructive/10 text-destructive",
  },
];