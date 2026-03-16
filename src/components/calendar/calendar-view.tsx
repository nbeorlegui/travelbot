"use client";

import { useMemo, useState } from "react";
import { calendarMock } from "@/lib/mock-data";
import { CalendarEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getEventStyles(type: CalendarEvent["tipo"]) {
  if (type === "salida") {
    return "border-emerald-200 bg-emerald-100 text-emerald-700";
  }

  if (type === "regreso") {
    return "border-sky-200 bg-sky-100 text-sky-700";
  }

  return "border-yellow-200 bg-yellow-100 text-yellow-700";
}

function getMonthGrid(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: Array<{ date: Date | null }> = [];

  for (let i = 0; i < firstWeekDay; i++) {
    cells.push({ date: null });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day) });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null });
  }

  return cells;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(() => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
    });
  const [events, setEvents] = useState<CalendarEvent[]>(calendarMock);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(() => formatDateInput(new Date()));
  const [eventType, setEventType] = useState<CalendarEvent["tipo"]>("recordatorio");
  const [error, setError] = useState("");

  const monthGrid = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  const visibleMonth = currentDate.getMonth();
  const visibleYear = currentDate.getFullYear();

  const monthEvents = useMemo(() => {
    return events
      .filter((event) => {
        const d = new Date(event.fecha + "T00:00:00");
        return d.getMonth() === visibleMonth && d.getFullYear() === visibleYear;
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [events, visibleMonth, visibleYear]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleAddEvent = () => {
    if (!title.trim() || !eventDate) {
      setError("Completá el título y la fecha del evento.");
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      fecha: eventDate,
      titulo: title.trim(),
      tipo: eventType,
    };

    setEvents((prev) =>
      [...prev, newEvent].sort((a, b) => a.fecha.localeCompare(b.fecha))
    );
    setTitle("");
    setEventDate(formatDateInput(new Date()));
    setEventType("recordatorio");
    setError("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
      <Card className="rounded-3xl border border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Calendario operativo</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Visualizá salidas, regresos y recordatorios de gestión.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-[180px] text-center text-sm font-semibold text-slate-700">
                {monthNames[visibleMonth]} {visibleYear}
              </div>

              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-7 gap-3 text-center text-sm font-medium text-slate-500">
            {weekDays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-3">
            {monthGrid.map((cell, index) => {
              if (!cell.date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[120px] rounded-2xl border border-dashed border-slate-200 bg-slate-50"
                  />
                );
              }

              const isoDate = formatDateInput(cell.date);
              const dayEvents = monthEvents.filter((event) => event.fecha === isoDate);

              return (
                <div
                  key={isoDate}
                  className="min-h-[120px] rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      {cell.date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`rounded-xl border px-2 py-1 text-[11px] font-medium ${getEventStyles(
                          event.tipo
                        )}`}
                        title={event.titulo}
                      >
                        {event.titulo}
                      </div>
                    ))}

                    {dayEvents.length > 3 && (
                      <div className="text-[11px] text-slate-400">
                        +{dayEvents.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-3xl border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle>Agregar evento</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ejemplo: Enviar vouchers"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Fecha</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tipo</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as CalendarEvent["tipo"])}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
              >
                <option value="recordatorio">Recordatorio</option>
                <option value="salida">Salida</option>
                <option value="regreso">Regreso</option>
              </select>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              className="w-full rounded-2xl bg-sky-500 hover:bg-sky-600"
              onClick={handleAddEvent}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear evento
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle>Próximos eventos</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {monthEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No hay eventos cargados para este mes.
              </div>
            ) : (
              monthEvents.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">
                        {event.titulo}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {event.fecha}
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${getEventStyles(
                        event.tipo
                      )}`}
                    >
                      {event.tipo === "salida"
                        ? "Salida"
                        : event.tipo === "regreso"
                        ? "Regreso"
                        : "Recordatorio"}
                    </span>
                  </div>
                </div>
              ))
            )}

            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Más adelante conectamos este módulo con Cotizaciones y Bot.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}