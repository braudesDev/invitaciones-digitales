export interface Consideraciones {
  mostrarSeccion: boolean;
  estilo: 'iconos' | 'tarjetas' | 'minimalista' | 'clasico' | 'elegante';
  titulo: string;
  subtitulo: string;
  mensajeIntro: string;
  colorIconos: string;
  items: ItemConsideracion[];
}

export interface ItemConsideracion {
  titulo: string;
  descripcion: string;
  icono?: string;
}

// Estilos disponibles
// src/app/models/consideraciones.model.ts

export const ESTILOS_CONSIDERACIONES = [
  { valor: 'iconos', nombre: 'Iconos en lista', icon: 'heroTag' },
  { valor: 'tarjetas', nombre: 'Tarjetas', icon: 'heroSquares2x2' },
  { valor: 'minimalista', nombre: 'Minimalista', icon: 'heroSparkles' },
  { valor: 'clasico', nombre: 'Clásico', icon: 'heroDocumentText' },
  { valor: 'elegante', nombre: 'Elegante', icon: 'hugeDiamond02' },
];
