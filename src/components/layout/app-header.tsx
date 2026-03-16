"use client";

import { AppSection } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  section: AppSection;
};

const titles: Record<AppSection, string> = {
  dashboard: "Dashboard",
  packages: "Paquetes",
  quotes: "Cotizaciones",
  calendar: "Calendario",
  messages: "Mensajes",
  bot: "Bot Simulador",
  "demo-web": "Demo Web"
};

export function AppHeader({ section }: AppHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {titles[section]}
        </h1>
        <p className="mt-1 text-slate-500">
          Demo funcional para agencias de viajes, lista para mostrar en Pantech.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Buscar..." className="pl-9" />
        </div>
        <Button variant="outline" className="rounded-2xl">
          Reiniciar demo
        </Button>
      </div>
    </div>
  );
}