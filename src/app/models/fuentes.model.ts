// src/app/models/fuentes.model.ts

// ================================================================
// MODELO: Fuentes de texto
// ================================================================

export interface Fuente {
  nombre: string; // Nombre visible para el usuario
  valor: string; // Valor CSS para font-family
  tipo: 'serif' | 'sans-serif' | 'script' | 'display';
  descripcion: string; // Breve descripción del estilo
  url: string; // URL de Google Fonts
}

// ================================================================
// FUENTES DISPONIBLES
// ================================================================
export const FUENTES_DISPONIBLES: Fuente[] = [
  // === SERIF (Clásicas) ===
  {
    nombre: 'Playfair Display',
    valor: "'Playfair Display', Georgia, serif",
    tipo: 'serif',
    descripcion: 'Elegante y clásica, ideal para bodas formales',
    url: 'Playfair+Display:wght@400;500;600;700',
  },
  {
    nombre: 'Cormorant Garamond',
    valor: "'Cormorant Garamond', Georgia, serif",
    tipo: 'serif',
    descripcion: 'Sofisticada con estilo europeo',
    url: 'Cormorant+Garamond:wght@400;500;600;700',
  },
  {
    nombre: 'Lora',
    valor: "'Lora', Georgia, serif",
    tipo: 'serif',
    descripcion: 'Equilibrada entre clásica y moderna',
    url: 'Lora:wght@400;500;600;700',
  },
  {
    nombre: 'Merriweather',
    valor: "'Merriweather', Georgia, serif",
    tipo: 'serif',
    descripcion: 'Legible y profesional',
    url: 'Merriweather:wght@400;700',
  },

  // === SCRIPT (Cursivas) ===
  {
    nombre: 'Great Vibes',
    valor: "'Great Vibes', cursive",
    tipo: 'script',
    descripcion: 'Caligrafía elegante, perfecta para títulos',
    url: 'Great+Vibes',
  },
  {
    nombre: 'Dancing Script',
    valor: "'Dancing Script', cursive",
    tipo: 'script',
    descripcion: 'Cursiva dinámica y moderna',
    url: 'Dancing+Script:wght@400;500;600;700',
  },
  {
    nombre: 'Tangerine',
    valor: "'Tangerine', cursive",
    tipo: 'script',
    descripcion: 'Caligrafía sofisticada y fluida',
    url: 'Tangerine:wght@400;700',
  },
  {
    nombre: 'Satisfy',
    valor: "'Satisfy', cursive",
    tipo: 'script',
    descripcion: 'Cursiva casual y encantadora',
    url: 'Satisfy',
  },

  // === SANS-SERIF (Modernas) ===
  {
    nombre: 'Montserrat',
    valor: "'Montserrat', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Moderna y minimalista',
    url: 'Montserrat:wght@300;400;500;600;700',
  },
  {
    nombre: 'Raleway',
    valor: "'Raleway', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Elegante y contemporánea',
    url: 'Raleway:wght@300;400;500;600;700',
  },
  {
    nombre: 'Quicksand',
    valor: "'Quicksand', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Suave y amigable',
    url: 'Quicksand:wght@300;400;500;600;700',
  },
  {
    nombre: 'Nunito',
    valor: "'Nunito', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Redondeada y moderna',
    url: 'Nunito:wght@300;400;500;600;700',
  },

  // === DISPLAY (Decorativas) ===
  {
    nombre: 'Cinzel',
    valor: "'Cinzel', Georgia, serif",
    tipo: 'display',
    descripcion: 'Decorativa con estilo renacentista',
    url: 'Cinzel:wght@400;500;600;700',
  },
  {
    nombre: 'Abril Fatface',
    valor: "'Abril Fatface', Georgia, serif",
    tipo: 'display',
    descripcion: 'Audaz y llamativa, ideal para títulos',
    url: 'Abril+Fatface',
  },
  {
    nombre: 'Bodoni Moda',
    valor: "'Bodoni Moda', Georgia, serif",
    tipo: 'display',
    descripcion: 'Contraste elegante y moderno',
    url: 'Bodoni+Moda:wght@400;500;600;700',
  },
];

// ================================================================
// FUENTE POR DEFECTO
// ================================================================
export const FUENTE_DEFAULT = FUENTES_DISPONIBLES[0]; // Playfair Display

// ================================================================
// UTILIDADES
// ================================================================

/**
 * Obtiene una fuente por su nombre
 */
export function getFuenteByNombre(nombre: string): Fuente | undefined {
  return FUENTES_DISPONIBLES.find((f) => f.nombre === nombre);
}

/**
 * Obtiene una fuente por su valor CSS
 */
export function getFuenteByValor(valor: string): Fuente | undefined {
  return FUENTES_DISPONIBLES.find((f) => f.valor === valor);
}

/**
 * Obtiene el nombre de una fuente a partir de su valor CSS
 */
export function getNombreFuente(valor: string): string {
  const fuente = getFuenteByValor(valor);
  return fuente?.nombre || valor;
}

/**
 * Obtiene fuentes agrupadas por tipo
 */
export function getFuentesAgrupadas(): { [key: string]: Fuente[] } {
  const grupos: { [key: string]: Fuente[] } = {
    serif: [],
    'sans-serif': [],
    script: [],
    display: [],
  };

  FUENTES_DISPONIBLES.forEach((f) => {
    if (grupos[f.tipo]) {
      grupos[f.tipo].push(f);
    }
  });

  return grupos;
}
