export interface Contador {
  mostrarSeccion: boolean;
  fechaEvento: string; // Fecha del evento (formato: YYYY-MM-DD)
  estilo: 'clasico' | 'minimalista' | 'floral' | 'romantico';
  titulo: string; // Ej: "Faltan para nuestro gran día"
  mensaje: string; // Mensaje debajo del contador
  colorPrincipal: string; // Color principal (hex)
  colores: {
    dias: string;
    horas: string;
    minutos: string;
    segundos: string;
  };
  etiquetas: {
    dias: string; // Ej: "DÍAS"
    horas: string; // Ej: "HORAS"
    minutos: string; // Ej: "MINUTOS"
    segundos: string; // Ej: "SEGUNDOS"
  };
}

// Estilos disponibles
// src/app/models/contador.model.ts

export const ESTILOS_CONTADOR = [
  { valor: 'clasico', nombre: 'Clásico elegante', icon: 'heroSparkles' },
  { valor: 'minimalista', nombre: 'Minimalista', icon: 'heroSquares2x2' },
  { valor: 'floral', nombre: 'Floral', icon: 'phosphorFlowerTulip' },
  { valor: 'romantico', nombre: 'Romántico', icon: 'heroHeart' },
];
