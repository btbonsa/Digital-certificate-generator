import { ExternalLink, FileText, LayoutDashboard, Users } from "lucide-react";

export const adminNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Recipients", href: "/recipients", icon: Users },
  { title: "Certificates", href: "/certificates", icon: FileText },
  { title: "Public verification", href: "/", icon: ExternalLink },
];
