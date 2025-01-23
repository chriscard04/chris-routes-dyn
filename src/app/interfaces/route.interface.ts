export interface Ruta {
  id_ruta: number;
  conductor: number;
  conductorName?: string;
  fecha_entrega: string;
  ordenes: Orden[];
  notas: string;
}

export interface Orden {
  id_orden: number;
  secuencia: number;
  valor: number;
  prioritario: boolean;
}

export interface Conductor {
  ID: string;
  NAME: string;
}

export interface Route {
  id: string;
  driverId: number;
  date: string;
  notes: string | null;
  orders: Order[];
}

export interface Order {
  id: number;
  sequence: number;
  value: number;
  priority: boolean;
}
