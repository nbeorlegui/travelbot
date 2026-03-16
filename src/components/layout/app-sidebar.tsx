"use client";

import { AppSection } from "@/lib/types";
import {
  Bot,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AppSidebarProps = {
  section: AppSection;
  onChangeSection: (section: AppSection) => void;
};

const items: {
  id: AppSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "packages", label: "Paquetes", icon: Package },
  { id: "quotes", label: "Cotizaciones", icon: FileText },
  { id: "calendar", label: "Calendario", icon: CalendarDays },
  { id: "bot", label: "Bot Simulador", icon: Bot },
  { id: "messages", label: "Mensajes", icon: MessageSquare },
];

export function AppSidebar({
  section,
  onChangeSection,
}: AppSidebarProps) {
  return (
    <aside className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-slate-50 p-4">
      <div>
        <div className="text-3xl font-bold text-slate-900">Pantech</div>
        <div className="text-3xl font-bold text-slate-900">Travel</div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-100 p-3">
            <User className="h-4 w-4 text-sky-700" />
          </div>
          <div>
            <div className="font-semibold">Admin Demo</div>
            <div className="text-sm text-slate-500">Operador</div>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = section === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-sky-500 text-white shadow"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <Button variant="outline" className="w-full justify-start rounded-2xl">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}