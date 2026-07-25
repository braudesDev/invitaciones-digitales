export interface Alojamiento {
  titulo: string;
  ubicacion: string;
  enlace: string;
  imagen?: string;
  capacidad?: string;
  distancia?: string;
}

export type EstiloHospedaje =
  | 'tarjetas'
  | 'timeline'
  | 'catalogo'
  | 'iconos'
  | 'mosaico';

export interface Hospedaje {
  mostrarSeccion: boolean;
  estilo: EstiloHospedaje;
  titulo: string;
  descripcion: string;
  alojamientos: Alojamiento[];
  textoBoton: string;
  textoAdicional: string;
}
