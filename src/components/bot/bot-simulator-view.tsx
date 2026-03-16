"use client";

import { useState } from "react";
import { MessageLead, QuoteItem } from "@/lib/types";
import { packagesMock } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Gift,
  MapPinned,
  MessageCircleMore,
  Plane,
  Sparkles,
} from "lucide-react";

type BotSimulatorViewProps = {
  quotes: QuoteItem[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  messages: MessageLead[];
  setMessages: React.Dispatch<React.SetStateAction<MessageLead[]>>;
  goToQuotes: () => void;
  goToMessages: () => void;
};

type BotState = {
  canal: "Bot Web" | "WhatsApp Business";
  nombre: string;
  telefono: string;
  step:
    | "ask_name"
    | "ask_phone"
    | "menu"
    | "pick_destination"
    | "ask_passengers"
    | "ask_ages"
    | "done";
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

function createInitialBotState(
  canal: "Bot Web" | "WhatsApp Business"
): BotState {
  return {
    canal,
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

function getNextQuoteNumber(quotes: QuoteItem[]) {
  const next = quotes.length + 1;
  return `COT-${String(next).padStart(5, "0")}`;
}

function registerMessageLead({
  canal,
  nombre,
  telefono,
  ultimoMensaje,
  estado,
  presupuestoEnviado,
  numeroPresupuesto,
  setMessages,
}: {
  canal: "Bot Web" | "WhatsApp Business";
  nombre: string;
  telefono: string;
  ultimoMensaje: string;
  estado: MessageLead["estado"];
  presupuestoEnviado: boolean;
  numeroPresupuesto?: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageLead[]>>;
}) {
  const now = new Date();

  const item: MessageLead = {
    id: Date.now(),
    canal,
    nombre,
    telefono,
    fecha: now.toLocaleDateString("es-AR"),
    hora: now.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ultimoMensaje,
    estado,
    presupuestoEnviado,
    numeroPresupuesto,
  };

  setMessages((prev) => [item, ...prev]);
}

function getMenuOptionIcon(option: string) {
  if (option === "Cotizar un viaje") {
    return <Plane className="h-4 w-4 text-sky-600" />;
  }

  if (option === "Destinos recomendados") {
    return <MapPinned className="h-4 w-4 text-sky-600" />;
  }

  if (option === "Medios de pago") {
    return <CreditCard className="h-4 w-4 text-sky-600" />;
  }

  if (option === "Promociones vigentes") {
    return <Gift className="h-4 w-4 text-sky-600" />;
  }

  if (option === "Hablar con un asesor") {
    return <MessageCircleMore className="h-4 w-4 text-sky-600" />;
  }

  return <Sparkles className="h-4 w-4 text-sky-600" />;
}

function BotPanel({
  title,
  tone,
  state,
  setState,
  quotes,
  setQuotes,
  setMessages,
  goToQuotes,
  goToMessages,
}: {
  title: string;
  tone: string;
  state: BotState;
  setState: React.Dispatch<React.SetStateAction<BotState>>;
  quotes: QuoteItem[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  setMessages: React.Dispatch<React.SetStateAction<MessageLead[]>>;
  goToQuotes: () => void;
  goToMessages: () => void;
}) {
  const addBotMessage = (text: string) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "bot", text }],
    }));
  };

  const addUserMessage = (text: string) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "user", text }],
    }));
  };

  const showMainMenu = () => {
    setState((prev) => ({
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
    const value = state.input.trim();
    if (!value) return;

    addUserMessage(value);

    if (state.step === "ask_name") {
      setState((prev) => ({
        ...prev,
        nombre: value,
        input: "",
        step: "ask_phone",
      }));
      addBotMessage(`Gracias ${value}. Ahora indicame tu teléfono de contacto.`);
      return;
    }

    if (state.step === "ask_phone") {
      setState((prev) => ({
        ...prev,
        telefono: value,
        input: "",
      }));
      addBotMessage(`Perfecto ${state.nombre || ""}. Elegí una opción del menú para continuar.`);
      setTimeout(() => showMainMenu(), 0);
      return;
    }

    if (state.step === "ask_passengers") {
      setState((prev) => ({
        ...prev,
        input: "",
        draft: { ...prev.draft, pasajeros: value },
        step: "ask_ages",
      }));
      addBotMessage("Ahora indicame las edades separadas por coma. Ejemplo: 35, 32, 7, 2");
      return;
    }

    if (state.step === "ask_ages") {
      const pkg =
        packagesMock.find(
          (item) =>
            item.destino.toLowerCase() === state.draft.destino.toLowerCase()
        ) || packagesMock[0];

      const quote: QuoteItem = {
        id: Date.now(),
        numero: getNextQuoteNumber(quotes),
        fechaCreacion: new Date().toLocaleDateString("es-AR"),
        fechaViaje: pkg.salida,
        destino: pkg.destino,
        hotel: pkg.hotel,
        pasajeros: Number(state.draft.pasajeros || 1),
        edades: value,
        precioBase: pkg.precio,
        total: Number(state.draft.pasajeros || 1) * pkg.precio,
        estado: "Enviada",
      };

      setQuotes((prev) => [quote, ...prev]);

      registerMessageLead({
        canal: state.canal,
        nombre: state.nombre,
        telefono: state.telefono,
        ultimoMensaje: `Presupuesto enviado para ${pkg.destino}`,
        estado: "Cotización enviada",
        presupuestoEnviado: true,
        numeroPresupuesto: quote.numero,
        setMessages,
      });

      setState((prev) => ({
        ...prev,
        input: "",
        draft: { ...prev.draft, edades: value },
        step: "done",
        menuOptions: [
          "Cotizar un viaje",
          "Destinos recomendados",
          "Medios de pago",
          "Promociones vigentes",
          "Hablar con un asesor",
        ],
      }));

      addBotMessage(
        `Excelente ${state.nombre}. Te enviamos el presupuesto ${quote.numero} para ${pkg.destino} por ${formatUsd(
          quote.total
        )}.`
      );

      setTimeout(() => {
        addBotMessage("Podés seguir consultando desde el menú.");
        setState((prev) => ({ ...prev, step: "menu" }));
      }, 0);

      return;
    }
  };

  const selectOption = (option: string) => {
    addUserMessage(option);

    if (option === "Cotizar un viaje") {
      setState((prev) => ({
        ...prev,
        step: "pick_destination",
        menuOptions: packagesMock.slice(0, 5).map((item) => item.destino),
      }));
      addBotMessage("Elegí el destino que querés cotizar.");
      return;
    }

    if (option === "Destinos recomendados") {
      registerMessageLead({
        canal: state.canal,
        nombre: state.nombre,
        telefono: state.telefono,
        ultimoMensaje: "Consultó destinos recomendados",
        estado: "En seguimiento",
        presupuestoEnviado: false,
        setMessages,
      });

      addBotMessage(
        "Hoy te recomendamos Punta Cana, Cancún, Bariloche y Río de Janeiro."
      );
      showMainMenu();
      return;
    }

    if (option === "Medios de pago") {
      registerMessageLead({
        canal: state.canal,
        nombre: state.nombre,
        telefono: state.telefono,
        ultimoMensaje: "Consultó medios de pago",
        estado: "En seguimiento",
        presupuestoEnviado: false,
        setMessages,
      });

      addBotMessage(
        "Podés pagar por transferencia, tarjeta y financiación según el paquete."
      );
      showMainMenu();
      return;
    }

    if (option === "Promociones vigentes") {
      registerMessageLead({
        canal: state.canal,
        nombre: state.nombre,
        telefono: state.telefono,
        ultimoMensaje: "Consultó promociones vigentes",
        estado: "En seguimiento",
        presupuestoEnviado: false,
        setMessages,
      });

      addBotMessage(
        "Tenemos promociones activas en Punta Cana, Cancún y Bariloche."
      );
      showMainMenu();
      return;
    }

    if (option === "Hablar con un asesor") {
      registerMessageLead({
        canal: state.canal,
        nombre: state.nombre,
        telefono: state.telefono,
        ultimoMensaje: "Solicitó hablar con un asesor",
        estado: "Nuevo",
        presupuestoEnviado: false,
        setMessages,
      });

      addBotMessage(
        "Perfecto. Ya registramos tu consulta para que un asesor te contacte."
      );
      showMainMenu();
      setTimeout(() => goToMessages(), 300);
      return;
    }

    if (state.step === "pick_destination") {
      setState((prev) => ({
        ...prev,
        draft: { ...prev.draft, destino: option },
        step: "ask_passengers",
        menuOptions: [],
      }));
      addBotMessage(`¿Cuántos pasajeros viajan a ${option}? Escribí solo un número.`);
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="text-sm text-slate-500">
              Simulación funcional del canal conversacional
            </p>
          </div>
          <Badge
            className={`rounded-full ${
                title.includes("WhatsApp")
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : "bg-sky-100 text-sky-700 hover:bg-sky-100"
            }`}
            >
            {tone}
            </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={`rounded-3xl p-4 ${
            title.includes("WhatsApp") ? "bg-[#ece5dd]" : "bg-slate-100"
          }`}
        >
          <div className="h-[430px] space-y-4 overflow-y-auto pr-2">
            {state.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.from === "bot"
                    ? "bg-white text-slate-700"
                    : "ml-auto bg-green-100 text-slate-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {state.menuOptions.length > 0 && (
            <div className="ml-auto max-w-[88%] rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Elegí una opción
                </div>

                <div className="flex flex-col gap-2">
                {state.menuOptions.map((option) => (
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
      </div></div>

        <div className="mt-4 flex gap-3">
          <Input
            placeholder={
              state.step === "menu" || state.step === "pick_destination"
                ? "Elegí una opción del menú dentro del chat"
                : "Escribí tu respuesta..."
            }
            value={state.input}
            disabled={state.step === "menu" || state.step === "pick_destination"}
            onChange={(e) =>
              setState((prev) => ({ ...prev, input: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") sendInput();
            }}
          />
         <Button
            className="rounded-2xl bg-sky-500 hover:bg-sky-600"
            onClick={sendInput}
            disabled={state.step === "menu" || state.step === "pick_destination"}
            >
            Enviar
            </Button>
        </div>

        <div className="mt-4 flex gap-2">
         <div className="mt-4 flex gap-2">
        <Button
            variant="outline"
            className="rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={goToMessages}
        >
            Ver mensajes
        </Button>
        <Button
            variant="outline"
            className="rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={goToQuotes}
        >
            Ver cotizaciones
        </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BotSimulatorView({
  quotes,
  setQuotes,
  messages,
  setMessages,
  goToQuotes,
  goToMessages,
}: BotSimulatorViewProps) {
  const [botWeb, setBotWeb] = useState<BotState>(
    createInitialBotState("Bot Web")
  );
  const [botWhatsapp, setBotWhatsapp] = useState<BotState>(
    createInitialBotState("WhatsApp Business")
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <BotPanel
        title="Bot Web"
        tone="Canal Web"
        state={botWeb}
        setState={setBotWeb}
        quotes={quotes}
        setQuotes={setQuotes}
        setMessages={setMessages}
        goToQuotes={goToQuotes}
        goToMessages={goToMessages}
      />

      <BotPanel
        title="WhatsApp Business"
        tone="WhatsApp"
        state={botWhatsapp}
        setState={setBotWhatsapp}
        quotes={quotes}
        setQuotes={setQuotes}
        setMessages={setMessages}
        goToQuotes={goToQuotes}
        goToMessages={goToMessages}
      />
    </div>
  );
}