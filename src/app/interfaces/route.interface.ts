export interface Ruta {
  id_ruta: number;
  conductor: string;
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
