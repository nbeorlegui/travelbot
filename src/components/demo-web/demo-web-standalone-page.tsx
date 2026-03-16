"use client";

import { useState } from "react";
import { packagesMock } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BedDouble,
  CalendarDays,
  Car,
  CreditCard,
  Gift,
  MapPinned,
  MessageCircleMore,
  Plane,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import Image from "next/image";

type WidgetBotState = {
  nombre: string;
  telefono: string;
  step:
    | "ask_name"
    | "ask_phone"
    | "menu"
    | "pick_destination"
    | "ask_passengers"
    | "ask_ages";
  messages: { from: "bot" | "user"; text: string }[];
  input: string;
  menuOptions: string[];
  draft: {
    destino: string;
    pasajeros: string;
    edades: string;
  };
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMenuOptionIcon(option: string) {
  if (option === "Cotizar un viaje") return <Plane className="h-4 w-4 text-sky-600" />;
  if (option === "Destinos recomendados") return <MapPinned className="h-4 w-4 text-sky-600" />;
  if (option === "Medios de pago") return <CreditCard className="h-4 w-4 text-sky-600" />;
  if (option === "Promociones vigentes") return <Gift className="h-4 w-4 text-sky-600" />;
  if (option === "Hablar con un asesor") return <MessageCircleMore className="h-4 w-4 text-sky-600" />;
  return <Sparkles className="h-4 w-4 text-sky-600" />;
}

function createInitialBotState(): WidgetBotState {
  return {
    nombre: "",
    telefono: "",
    step: "ask_name",
    input: "",
    menuOptions: [],
    draft: {
      destino: "",
      pasajeros: "",
      edades: "",
    },
    messages: [
      {
        from: "bot",
        text: "Hola, soy el asistente virtual de Pantech Travel. ¿Cuál es tu nombre?",
      },
    ],
  };
}

export function DemoWebStandalonePage() {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [bot, setBot] = useState<WidgetBotState>(createInitialBotState());

  const quickActions = [
    { label: "Hoteles", icon: BedDouble },
    { label: "Pasajes", icon: Plane },
    { label: "Paquetes", icon: Sparkles },
    { label: "Excursiones", icon: MapPinned },
    { label: "Alquiler de autos", icon: Car },
  ];

  const addBotMessage = (text: string) => {
    setBot((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "bot", text }],
    }));
  };

  const addUserMessage = (text: string) => {
    setBot((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "user", text }],
    }));
  };

  const showMainMenu = () => {
    setBot((prev) => ({
      ...prev,
      step: "menu",
      menuOptions: [
        "Cotizar un viaje",
        "Destinos recomendados",
        "Medios de pago",
        "Promociones vigentes",
        "Hablar con un asesor",
      ],
    }));
  };

  const sendInput = () => {
    const value = bot.input.trim();
    if (!value) return;

    addUserMessage(value);

    if (bot.step === "ask_name") {
      setBot((prev) => ({
        ...prev,
        nombre: value,
        input: "",
        step: "ask_phone",
      }));
      addBotMessage(`Gracias ${value}. Ahora indicame tu teléfono de contacto.`);
      return;
    }

    if (bot.step === "ask_phone") {
      setBot((prev) => ({
        ...prev,
        telefono: value,
        input: "",
      }));
      addBotMessage(`Perfecto ${bot.nombre || ""}. Elegí una opción para continuar.`);
      setTimeout(() => showMainMenu(), 0);
      return;
    }

    if (bot.step === "ask_passengers") {
      setBot((prev) => ({
        ...prev,
        input: "",
        draft: { ...prev.draft, pasajeros: value },
        step: "ask_ages",
      }));
      addBotMessage("Ahora indicame las edades separadas por coma. Ejemplo: 35, 32, 7, 2");
      return;
    }

    if (bot.step === "ask_ages") {
      const pkg =
        packagesMock.find(
          (item) => item.destino.toLowerCase() === bot.draft.destino.toLowerCase()
        ) || packagesMock[0];

      setBot((prev) => ({
        ...prev,
        input: "",
        draft: { ...prev.draft, edades: value },
        step: "menu",
        menuOptions: [
          "Cotizar un viaje",
          "Destinos recomendados",
          "Medios de pago",
          "Promociones vigentes",
          "Hablar con un asesor",
        ],
      }));

      addBotMessage(
        `Excelente ${bot.nombre}. Te enviamos una cotización estimada para ${pkg.destino} desde ${formatUsd(
          pkg.precio
        )} por pasajero.`
      );
      return;
    }
  };

  const selectOption = (option: string) => {
    addUserMessage(option);

    if (option === "Cotizar un viaje") {
      setBot((prev) => ({
        ...prev,
        step: "pick_destination",
        menuOptions: packagesMock.slice(0, 5).map((item) => item.destino),
      }));
      addBotMessage("Elegí el destino que querés cotizar.");
      return;
    }

    if (option === "Destinos recomendados") {
      addBotMessage("Hoy te recomendamos Punta Cana, Cancún, Bariloche y Río de Janeiro.");
      showMainMenu();
      return;
    }

    if (option === "Medios de pago") {
      addBotMessage("Podés pagar por transferencia, tarjeta y financiación según el paquete.");
      showMainMenu();
      return;
    }

    if (option === "Promociones vigentes") {
      addBotMessage("Tenemos promociones activas en Punta Cana, Cancún y Bariloche.");
      showMainMenu();
      return;
    }

    if (option === "Hablar con un asesor") {
      addBotMessage("Perfecto. Ya registramos tu consulta para que un asesor te contacte.");
      showMainMenu();
      return;
    }

    if (bot.step === "pick_destination") {
      setBot((prev) => ({
        ...prev,
        draft: { ...prev.draft, destino: option },
        step: "ask_passengers",
        menuOptions: [],
      }));
      addBotMessage(`¿Cuántos pasajeros viajan a ${option}? Escribí solo un número.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">Pantech Travel</div>
            <div className="text-sm text-slate-500">Viajá con atención personalizada</div>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <span>Inicio</span>
            <span>Destinos</span>
            <span>Promociones</span>
            <span>Paquetes</span>
            <span>Contacto</span>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm">
            Ofertas destacadas de temporada
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight">
            Descubrí tu próximo viaje con ayuda inmediata desde la web
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Paquetes, hoteles, pasajes y excursiones con asistencia virtual en tiempo real.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
            <Input placeholder="¿A dónde querés viajar?" />
            <Input type="date" />
            <Input type="date" />
            <Button className="rounded-2xl bg-sky-500 hover:bg-sky-600">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-sky-50"
                >
                  <div className="rounded-xl bg-sky-100 p-2">
                    <Icon className="h-4 w-4 text-sky-600" />
                  </div>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packagesMock.slice(0, 6).map((pkg) => (
            <div
              key={pkg.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-36 bg-gradient-to-br from-sky-200 via-cyan-200 to-blue-300" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{pkg.destino}</h3>
                    <p className="text-sm text-slate-500">{pkg.hotel}</p>
                  </div>
                  <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {pkg.pais}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {pkg.salida}
                  </div>
                  <div>{pkg.noches} noches</div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Desde</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatUsd(pkg.precio)}
                    </div>
                  </div>

                  <Button
                    className="rounded-2xl bg-sky-500 hover:bg-sky-600"
                    onClick={() => setWidgetOpen(true)}
                  >
                    Consultar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-lg font-semibold text-slate-900">Atención personalizada</div>
            <p className="mt-2 text-sm text-slate-500">
              Nuestro asistente virtual te ayuda a iniciar tu viaje en minutos.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-lg font-semibold text-slate-900">Promociones reales</div>
            <p className="mt-2 text-sm text-slate-500">
              Mostrá ofertas destacadas, destinos y beneficios de temporada.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-lg font-semibold text-slate-900">Cotización rápida</div>
            <p className="mt-2 text-sm text-slate-500">
              Capturá leads y generá presupuestos desde la web comercial.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center text-sm text-slate-500">
        © 2026 Pantech Travel · 
      </footer>

  {!widgetOpen && (
  <button
    onClick={() => setWidgetOpen(true)}
    className="fixed bottom-6 right-6 z-50"
    aria-label="Abrir asistente virtual"
  >
    <div className="relative w-[190px]">
      <div className="rounded-[26px] bg-white px-5 py-4 shadow-xl ring-1 ring-slate-200">
        <div className="text-[15px] font-semibold leading-none text-slate-900">
          Asistente virtual
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-600">Online</span>
        </div>
      </div>

      <div className="pointer-events-none absolute -top-[166px] left-1/2 h-[260px] w-[260px] -translate-x-1/2">
        <Image
          src="/bot_imagev2.png"
          alt="Asistente virtual"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  </button>
)}

      {widgetOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-sky-500 px-4 py-3 text-white">
            <div>
              <div className="font-semibold">Asistente virtual</div>
              <div className="text-xs text-white/80">Bot Web</div>
            </div>
            <button onClick={() => setWidgetOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-slate-100 p-3">
            <div className="h-[360px] space-y-4 overflow-y-auto rounded-3xl bg-slate-100 p-2">
              {bot.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.from === "bot"
                      ? "bg-white text-slate-700"
                      : "ml-auto bg-sky-100 text-slate-800"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {bot.menuOptions.length > 0 && (
                <div className="ml-auto max-w-[92%] rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Elegí una opción
                  </div>

                  <div className="flex flex-col gap-2">
                    {bot.menuOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectOption(option)}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
                      >
                        <div className="rounded-xl bg-sky-100 p-2">
                          {getMenuOptionIcon(option)}
                        </div>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                placeholder={
                  bot.step === "menu" || bot.step === "pick_destination"
                    ? "Elegí una opción del menú"
                    : "Escribí tu respuesta..."
                }
                value={bot.input}
                disabled={bot.step === "menu" || bot.step === "pick_destination"}
                onChange={(e) =>
                  setBot((prev) => ({ ...prev, input: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendInput();
                }}
              />
              <Button
                className="rounded-2xl bg-sky-500 hover:bg-sky-600"
                onClick={sendInput}
                disabled={bot.step === "menu" || bot.step === "pick_destination"}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}