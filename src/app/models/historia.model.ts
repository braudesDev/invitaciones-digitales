// src/app/models/historia.model.ts

export interface Momento {
  fecha: string;
  descripcion: string;
  imagen?: string; // Opcional: imagen para ese momento
}

export type EstiloHistoria = 'timeline' | 'tarjetas' | 'album' | 'minimalista';

export interface Historia {
  mostrarSeccion: boolean;
  estilo: EstiloHistoria;
  titulo: string;
  descripcion: string;
  momentos: Momento[];
  fontFamily?: string; // Nueva propiedad para la fuente
}
