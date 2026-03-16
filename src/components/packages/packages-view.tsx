"use client";

import { useMemo, useState } from "react";
import { QuoteItem, TravelPackage } from "@/lib/types";
import { packagesMock } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarDays, Hotel, Moon, Search, Wallet } from "lucide-react";

type PackagesViewProps = {
  quotes: QuoteItem[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  goToQuotes: () => void;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getNextQuoteNumber(quotes: QuoteItem[]) {
  const next = quotes.length + 1;
  return `COT-${String(next).padStart(5, "0")}`;
}

function downloadQuotePdf(quote: QuoteItem) {
  const content = `
PANTECH TRAVEL
COTIZACIÓN ${quote.numero}

Fecha de creación: ${quote.fechaCreacion}
Destino: ${quote.destino}
Hotel: ${quote.hotel}
Fecha de viaje: ${quote.fechaViaje}
Pasajeros: ${quote.pasajeros}
Edades: ${quote.edades}

Precio base por pasajero: ${formatUsd(quote.precioBase)}
Total estimado: ${formatUsd(quote.total)}

Documento generado automáticamente por la demo.
  `.trim();

  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quote.numero}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

function QuoteModal({
  pkg,
  quotes,
  setQuotes,
  goToQuotes,
}: {
  pkg: TravelPackage;
  quotes: QuoteItem[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  goToQuotes: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [fechaViaje, setFechaViaje] = useState(pkg.salida);
  const [pasajeros, setPasajeros] = useState("2");
  const [edades, setEdades] = useState("35, 32");
  const [error, setError] = useState("");

  const total = Number(pasajeros || 0) * pkg.precio;

  const handleGenerate = () => {
    if (!fechaViaje || !pasajeros || Number(pasajeros) <= 0 || !edades.trim()) {
      setError("Completá fecha de viaje, cantidad de pasajeros y edades.");
      return;
    }

    const now = new Date();
    const quote: QuoteItem = {
      id: Date.now(),
      numero: getNextQuoteNumber(quotes),
      fechaCreacion: now.toLocaleDateString("es-AR"),
      fechaViaje,
      destino: pkg.destino,
      hotel: pkg.hotel,
      pasajeros: Number(pasajeros),
      edades,
      precioBase: pkg.precio,
      total,
      estado: "Generada",
    };

    setQuotes((prev) => [quote, ...prev]);
    downloadQuotePdf(quote);
    setOpen(false);
    goToQuotes();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-sky-500 hover:bg-sky-600">
          Cotizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Cotizar {pkg.destino} · {pkg.hotel}
          </DialogTitle>
          <DialogDescription>
            Ingresá los datos para generar la cotización y descargar el PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Fecha de viaje
              </label>
              <Input
                type="date"
                value={fechaViaje}
                onChange={(e) => setFechaViaje(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Cantidad de pasajeros
              </label>
              <Input
                type="number"
                min="1"
                value={pasajeros}
                onChange={(e) => setPasajeros(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Edades
            </label>
            <Input
              value={edades}
              onChange={(e) => setEdades(e.target.value)}
              placeholder="Ejemplo: 35, 32, 7, 2"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Precio base por pasajero
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {formatUsd(pkg.precio)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Total estimado
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {formatUsd(total)}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button className="rounded-2xl bg-sky-500 hover:bg-sky-600" onClick={handleGenerate}>
              Generar cotización
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PackagesView({
  quotes,
  setQuotes,
  goToQuotes,
}: PackagesViewProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("Todos");

  const countries = useMemo(() => {
    return ["Todos", ...Array.from(new Set(packagesMock.map((item) => item.pais)))];
  }, []);

  const filteredPackages = useMemo(() => {
    return packagesMock.filter((item) => {
      const text = [
        item.destino,
        item.hotel,
        item.pais,
        item.regimen,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCountry =
        countryFilter === "Todos" || item.pais === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [search, countryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por destino, hotel, país o régimen..."
              className="pl-9"
            />
          </div>

          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-500">
          {filteredPackages.length} paquete{filteredPackages.length !== 1 ? "s" : ""} encontrado{filteredPackages.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="relative h-44 bg-gradient-to-br from-sky-200 via-cyan-200 to-blue-300">
              <div className="absolute left-4 top-4">
                <Badge className="rounded-full bg-white/90 text-slate-700 hover:bg-white/90">
                  {pkg.pais}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-2xl bg-white/85 p-3 backdrop-blur">
                  <div className="text-xl font-bold text-slate-900">
                    {pkg.destino}
                  </div>
                  <div className="text-sm text-slate-600">{pkg.hotel}</div>
                </div>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <Moon className="h-4 w-4 text-sky-600" />
                  <span>{pkg.noches} noches</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <CalendarDays className="h-4 w-4 text-violet-600" />
                  <span>{pkg.salida}</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <Hotel className="h-4 w-4 text-emerald-600" />
                  <span>{pkg.regimen}</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                  <Wallet className="h-4 w-4 text-amber-600" />
                  <span>{formatUsd(pkg.precio)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Desde
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatUsd(pkg.precio)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-2xl">
                        Ver detalle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>
                          {pkg.destino} · {pkg.hotel}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="text-xs uppercase tracking-wide text-slate-400">
                            País
                          </div>
                          <div className="mt-1 font-medium text-slate-900">
                            {pkg.pais}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="text-xs uppercase tracking-wide text-slate-400">
                            Régimen
                          </div>
                          <div className="mt-1 font-medium text-slate-900">
                            {pkg.regimen}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="text-xs uppercase tracking-wide text-slate-400">
                            Duración
                          </div>
                          <div className="mt-1 font-medium text-slate-900">
                            {pkg.noches} noches
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="text-xs uppercase tracking-wide text-slate-400">
                            Precio base
                          </div>
                          <div className="mt-1 font-medium text-slate-900">
                            {formatUsd(pkg.precio)}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <QuoteModal
                    pkg={pkg}
                    quotes={quotes}
                    setQuotes={setQuotes}
                    goToQuotes={goToQuotes}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-lg font-semibold text-slate-900">
            No encontramos paquetes
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Probá con otro destino, hotel, país o régimen.
          </div>
        </div>
      )}
    </div>
  );
}