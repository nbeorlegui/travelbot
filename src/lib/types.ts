export type AppSection =
  | "dashboard"
  | "packages"
  | "quotes"
  | "calendar"
  | "messages"
  | "bot";

export type TravelPackage = {
  id: number;
  destino: string;
  hotel: string;
  pais: string;
  noches: number;
  precio: number;
  salida: string;
  regimen: string;
};

export type MessageLead = {
  id: number;
  canal: "Bot Web" | "WhatsApp Business";
  nombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  ultimoMensaje: string;
  estado: "Nuevo" | "En seguimiento" | "Cotización enviada" | "Cerrado";
  presupuestoEnviado: boolean;
  numeroPresupuesto?: string;
};

export type CalendarEvent = {
  id: number;
  fecha: string;
  titulo: string;
  tipo: "salida" | "regreso" | "recordatorio";
};

export type QuoteItem = {
  id: number;
  numero: string;
  fechaCreacion: string;
  fechaViaje: string;
  destino: string;
  hotel: string;
  pasajeros: number;
  edades: string;
  precioBase: number;
  total: number;
  estado: "Generada" | "Enviada" | "Pendiente";
};