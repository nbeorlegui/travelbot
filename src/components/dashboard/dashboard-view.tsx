"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  TrendingUp,
  Users,
  ExternalLink,
} from "lucide-react";

const salesByMonth = [
  { month: "Ene", value: 8 },
  { month: "Feb", value: 11 },
  { month: "Mar", value: 14 },
  { month: "Abr", value: 10 },
  { month: "May", value: 17 },
  { month: "Jun", value: 21 },
];

const destinations = [
  { name: "Punta Cana", value: 18 },
  { name: "Cancún", value: 14 },
  { name: "Bariloche", value: 10 },
  { name: "Río", value: 8 },
  { name: "Madrid", value: 6 },
];

const upcomingTrips = [
  {
    id: 1,
    passenger: "Laura Gómez",
    destination: "Punta Cana",
    date: "12 Jul 2026",
    status: "ok",
  },
  {
    id: 2,
    passenger: "Martín Pérez",
    destination: "Cancún",
    date: "14 Jul 2026",
    status: "warning",
  },
  {
    id: 3,
    passenger: "Carla Torres",
    destination: "Río de Janeiro",
    date: "16 Jul 2026",
    status: "danger",
  },
  {
    id: 4,
    passenger: "Familia Suárez",
    destination: "Bariloche",
    date: "18 Jul 2026",
    status: "ok",
  },
];

const alerts = [
  {
    id: 1,
    title: "Check-in pendiente",
    description: "Martín Pérez viaja en 48 hs y aún no confirmó check-in.",
    level: "warning",
  },
  {
    id: 2,
    title: "Voucher no enviado",
    description: "Carla Torres sale mañana y falta enviar documentación.",
    level: "danger",
  },
  {
    id: 3,
    title: "Pago acreditado",
    description: "Reserva de Laura Gómez confirmada correctamente.",
    level: "success",
  },
  {
    id: 4,
    title: "Asistencia al viajero validada",
    description: "Familia Suárez ya tiene cobertura registrada.",
    level: "success",
  },
];

const agenda = [
  { id: 1, day: "10", title: "Enviar vouchers", type: "warning" },
  { id: 2, day: "12", title: "Salida Laura Gómez", type: "success" },
  { id: 3, day: "14", title: "Check-in Martín Pérez", type: "warning" },
  { id: 4, day: "16", title: "Salida Carla Torres", type: "danger" },
  { id: 5, day: "18", title: "Salida Familia Suárez", type: "success" },
  { id: 6, day: "21", title: "Cobro saldo pendiente", type: "warning" },
];

function getAlertStyles(level: string) {
  if (level === "danger") {
    return {
      wrapper: "border-red-200 bg-red-50",
      badge: "bg-red-100 text-red-700",
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    };
  }

  if (level === "warning") {
    return {
      wrapper: "border-yellow-200 bg-yellow-50",
      badge: "bg-yellow-100 text-yellow-700",
      icon: <Clock3 className="h-4 w-4 text-yellow-600" />,
    };
  }

  return {
    wrapper: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  };
}

function getTripDot(status: string) {
  if (status === "danger") return "bg-red-500";
  if (status === "warning") return "bg-yellow-500";
  return "bg-emerald-500";
}

function getAgendaColor(type: string) {
  if (type === "danger") return "bg-red-100 text-red-700 border-red-200";
  if (type === "warning") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export function DashboardView() {
  const maxSales = Math.max(...salesByMonth.map((item) => item.value));
  const maxDestination = Math.max(...destinations.map((item) => item.value));

  const kpis = [
    {
      label: "Paquetes vendidos",
      value: 128,
      hint: "+14% este mes",
      icon: <Plane className="h-4 w-4 text-sky-600" />,
    },
    {
      label: "Cotizaciones activas",
      value: 36,
      hint: "12 por cerrar",
      icon: <TrendingUp className="h-4 w-4 text-violet-600" />,
    },
    {
      label: "Pasajeros próximos",
      value: 24,
      hint: "7 días",
      icon: <Users className="h-4 w-4 text-emerald-600" />,
    },
    {
      label: "Alertas operativas",
      value: 7,
      hint: "2 críticas",
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    },
  ];

  const openDemoWeb = () => {
    window.open("/demo-web", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openDemoWeb}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-600"
        >
          <ExternalLink className="h-4 w-4" />
          Abrir Demo Web
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Card key={item.label} className="rounded-3xl border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className="rounded-2xl bg-slate-100 p-2">{item.icon}</div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div className="text-4xl font-bold text-slate-900">
                  {item.value}
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {item.hint}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="rounded-3xl border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle>Ventas por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-4">
              {salesByMonth.map((item) => {
                const height = `${(item.value / maxSales) * 100}%`;

                return (
                  <div
                    key={item.month}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="text-sm font-medium text-slate-500">
                      {item.value}
                    </div>
                    <div className="flex h-56 w-full items-end rounded-2xl bg-slate-100 p-2">
                      <div
                        className="w-full rounded-xl bg-sky-500 transition-all hover:opacity-90"
                        style={{ height }}
                        title={`${item.month}: ${item.value} ventas`}
                      />
                    </div>
                    <div className="text-sm text-slate-500">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle>Destinos más vendidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {destinations.map((item) => (
              <div
                key={item.name}
                className="space-y-2"
                title={`${item.name}: ${item.value} ventas`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.name}
                  </span>
                  <span className="text-slate-500">{item.value} ventas</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-violet-500 transition-all hover:opacity-90"
                    style={{ width: `${(item.value / maxDestination) * 100}%` }}
                    title={`${item.name}: ${item.value} ventas`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_0.95fr]">
        <Card className="rounded-3xl border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle>Próximas salidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                title={`${trip.passenger} · ${trip.destination} · ${trip.date}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${getTripDot(trip.status)}`}
                  />
                  <div>
                    <div className="font-medium text-slate-900">
                      {trip.passenger}
                    </div>
                    <div className="text-sm text-slate-500">
                      {trip.destination}
                    </div>
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-600">
                  {trip.date}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle>Calendario operativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {agenda.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-3 ${getAgendaColor(item.type)}`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    Día {item.day}
                  </div>
                  <div className="mt-2 text-sm font-medium">{item.title}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Vista resumida de tareas, salidas y seguimientos.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => {
              const styles = getAlertStyles(alert.level);

              return (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-4 ${styles.wrapper}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{styles.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-slate-900">
                          {alert.title}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${styles.badge}`}
                        >
                          {alert.level === "danger"
                            ? "Alta"
                            : alert.level === "warning"
                              ? "Media"
                              : "OK"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}