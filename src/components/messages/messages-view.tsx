"use client";

import { useMemo, useState } from "react";
import { MessageLead } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type MessagesViewProps = {
  messages: MessageLead[];
};

const ITEMS_PER_PAGE = 4;

function getChannelBadgeClasses(canal: MessageLead["canal"]) {
  if (canal === "WhatsApp Business") {
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  }

  return "bg-sky-100 text-sky-700 hover:bg-sky-100";
}

export function MessagesView({ messages }: MessagesViewProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(messages.length / ITEMS_PER_PAGE));

  const paginatedMessages = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return messages.slice(start, end);
  }, [messages, page]);

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1));
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Historial de mensajes</CardTitle>

            {messages.length > 0 && (
              <div className="text-sm text-slate-500">
                Mostrando {paginatedMessages.length} de {messages.length} conversaciones
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <div className="text-lg font-semibold text-slate-900">
                Aún no hay conversaciones
              </div>
              <div className="mt-2 text-sm text-slate-500">
                Iniciá una conversación desde Bot Simulador.
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {msg.nombre}
                          </h3>

                          <Badge
                            className={`rounded-full ${getChannelBadgeClasses(msg.canal)}`}
                          >
                            {msg.canal}
                          </Badge>

                          <Badge variant="secondary" className="rounded-full">
                            {msg.estado}
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {msg.telefono}
                          </div>

                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            {msg.ultimoMensaje}
                          </div>

                          <div>
                            <strong>Fecha:</strong> {msg.fecha} · {msg.hora}
                          </div>

                          {msg.presupuestoEnviado ? (
                            <div className="flex items-center gap-2 text-sky-700">
                              <FileText className="h-4 w-4" />
                              Presupuesto enviado
                              {msg.numeroPresupuesto
                                ? ` · ${msg.numeroPresupuesto}`
                                : ""}
                            </div>
                          ) : (
                            <div className="text-slate-400">
                              Sin presupuesto enviado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-sm text-slate-500">
                    Página {page} de {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={goPrev}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Anterior
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={goNext}
                      disabled={page === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}