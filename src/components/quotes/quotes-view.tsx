"use client";

import { QuoteItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type QuotesViewProps = {
  quotes: QuoteItem[];
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuotesView({ quotes }: QuotesViewProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-slate-200">
        <CardHeader>
          <CardTitle>Cotizaciones generadas</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <div className="text-lg font-semibold text-slate-900">
                Aún no hay cotizaciones
              </div>
              <div className="mt-2 text-sm text-slate-500">
                Generá una cotización desde el módulo Paquetes.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {quote.numero}
                        </h3>
                        <Badge className="rounded-full">{quote.estado}</Badge>
                      </div>

                      <div className="mt-2 grid gap-1 text-sm text-slate-500">
                        <div>
                          <strong>Destino:</strong> {quote.destino}
                        </div>
                        <div>
                          <strong>Hotel:</strong> {quote.hotel}
                        </div>
                        <div>
                          <strong>Fecha de viaje:</strong> {quote.fechaViaje}
                        </div>
                        <div>
                          <strong>Pasajeros:</strong> {quote.pasajeros}
                        </div>
                        <div>
                          <strong>Edades:</strong> {quote.edades}
                        </div>
                        <div>
                          <strong>Creada:</strong> {quote.fechaCreacion}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wide text-slate-400">
                        Total
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {formatUsd(quote.total)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}