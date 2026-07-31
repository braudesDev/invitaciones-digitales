export interface Confirmacion {
  mostrarSeccion: boolean;
  estilo: 'tarjetas' | 'minimalista' | 'lista' | 'elegante' | 'moderno';
  titulo: string;
  descripcion: string;
  mostrarConfirmar: boolean;
  mostrarRechazar: boolean;
  mostrarCalendario: boolean;
}

export const ESTILOS_CONFIRMACION = [
  { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
  { valor: 'minimalista', nombre: 'Minimalista', icon: '✨' },
  { valor: 'lista', nombre: 'Lista', icon: '📋' },
  { valor: 'elegante', nombre: 'Elegante', icon: '💎' },
  { valor: 'moderno', nombre: 'Moderno', icon: '🌟' },
];
