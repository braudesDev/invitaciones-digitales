export interface Confirmacion {
  mostrarSeccion: boolean;
  estilo: 'tarjetas' | 'minimalista' | 'lista' | 'elegante' | 'moderno';
  titulo: string;
  descripcion: string;
  mostrarConfirmar: boolean;
  mostrarRechazar: boolean;
  mostrarCalendario: boolean;
}

// src/app/models/confirmacion.model.ts

export const ESTILOS_CONFIRMACION = [
  { valor: 'tarjetas', nombre: 'Tarjetas', icon: 'heroSquares2x2' },
  { valor: 'minimalista', nombre: 'Minimalista', icon: 'heroSparkles' },
  { valor: 'lista', nombre: 'Lista', icon: 'heroListBullet' },
  { valor: 'elegante', nombre: 'Elegante', icon: 'hugeDiamond02' },
  { valor: 'moderno', nombre: 'Moderno', icon: 'heroStar' },
];
