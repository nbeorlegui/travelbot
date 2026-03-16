import { CalendarEvent, MessageLead, TravelPackage } from "./types";

export const packagesMock: TravelPackage[] = [
  {
    id: 1,
    destino: "Punta Cana",
    hotel: "Riu Palace Bavaro",
    pais: "República Dominicana",
    noches: 7,
    precio: 1850,
    salida: "2028-07-12",
    regimen: "All Inclusive",
  },
  {
    id: 2,
    destino: "Cancún",
    hotel: "Moon Palace",
    pais: "México",
    noches: 8,
    precio: 2140,
    salida: "2028-08-05",
    regimen: "All Inclusive",
  },
  {
    id: 3,
    destino: "Bariloche",
    hotel: "Llao Llao",
    pais: "Argentina",
    noches: 5,
    precio: 920,
    salida: "2028-07-20",
    regimen: "Desayuno",
  },
  {
    id: 4,
    destino: "Río de Janeiro",
    hotel: "Windsor Barra",
    pais: "Brasil",
    noches: 6,
    precio: 1160,
    salida: "2028-09-10",
    regimen: "Media pensión",
  },
  {
    id: 5,
    destino: "Madrid",
    hotel: "Riu Plaza España",
    pais: "España",
    noches: 9,
    precio: 2390,
    salida: "2028-10-01",
    regimen: "Desayuno",
  },
  {
    id: 6,
    destino: "Miami",
    hotel: "Fontainebleau",
    pais: "Estados Unidos",
    noches: 7,
    precio: 2640,
    salida: "2028-11-14",
    regimen: "Solo alojamiento",
  },
];

export const messagesMock: MessageLead[] = [
  {
    id: 1,
    canal: "Bot Web",
    nombre: "Laura Gómez",
    telefono: "+54 9 11 2345 6789",
    fecha: "12/07/2026",
    hora: "10:20",
    ultimoMensaje: "Quisiera cotizar Punta Cana para 4 pasajeros",
    estado: "Cotización enviada",
    presupuestoEnviado: true,
    numeroPresupuesto: "COT-00001",
  },
  {
    id: 2,
    canal: "WhatsApp Business",
    nombre: "Martín Pérez",
    telefono: "+54 9 261 555 1122",
    fecha: "12/07/2026",
    hora: "11:05",
    ultimoMensaje: "¿Qué promociones tienen para Cancún?",
    estado: "En seguimiento",
    presupuestoEnviado: false,
  },
];

export const calendarMock: CalendarEvent[] = (() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const pad = (n: number) => String(n).padStart(2, "0");
  const makeDate = (day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

  return [
    {
      id: 1,
      fecha: makeDate(12),
      titulo: "Salida Laura Gómez - Punta Cana",
      tipo: "salida",
    },
    {
      id: 2,
      fecha: makeDate(19),
      titulo: "Regreso Laura Gómez - Punta Cana",
      tipo: "regreso",
    },
    {
      id: 3,
      fecha: makeDate(15),
      titulo: "Enviar vouchers pendientes",
      tipo: "recordatorio",
    },
  ];
})();