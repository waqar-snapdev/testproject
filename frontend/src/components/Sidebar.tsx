import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HeartPulse,
  Calendar,
  Pill,
  Users,
  FileText,
  LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/symptoms", label: "Symptom Tracker", icon: HeartPulse },
  { href: "/blood-pressure", label: "Blood Pressure", icon: HeartPulse },
  { href: "/vitals", label: "Vitals", icon: HeartPulse },
  { href: "/timeline", label: "Care Timeline", icon: Calendar },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/family", label: "Family View", icon: Users },
  { href: "/export", label: "Export Summary", icon: FileText },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden border-r bg-muted/40 md:block print:hidden">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M4.5 12.5l3-3 4.5 4.5 6-6" />
              <path d="M3.5 20.5v-17" />
            </svg>
            <span className="">Health Journey</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  { "bg-muted text-primary": location.pathname === link.href }
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;