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
export const ESTILOS_CONSIDERACIONES = [
  { valor: 'iconos', nombre: 'Iconos en lista', icon: '🎯' },
  { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
  { valor: 'minimalista', nombre: 'Minimalista', icon: '✨' },
  { valor: 'clasico', nombre: 'Clásico', icon: '📜' },
  { valor: 'elegante', nombre: 'Elegante', icon: '💎' },
];
