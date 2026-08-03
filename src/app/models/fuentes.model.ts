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
  // === SERIF (Clásicas) - EXISTENTES ===
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
  // === NUEVAS SERIF ===
  {
    nombre: 'Marcellus',
    valor: "'Marcellus', Georgia, serif",
    tipo: 'serif',
    descripcion: 'Elegante con un toque moderno, ideal para títulos de bodas',
    url: 'Marcellus',
  },
  {
    nombre: 'Prata',
    valor: "'Prata', Georgia, serif",
    tipo: 'serif',
    descripcion:
      'Serif refinada con gran legibilidad, perfecta para invitaciones',
    url: 'Prata',
  },
  {
    nombre: 'Alegreya',
    valor: "'Alegreya', Georgia, serif",
    tipo: 'serif',
    descripcion: 'Calidez y elegancia para textos largos en invitaciones',
    url: 'Alegreya:wght@400;500;600;700',
  },

  // === SCRIPT (Cursivas) - EXISTENTES ===
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
  // === NUEVAS SCRIPT ===
  {
    nombre: 'Parisienne',
    valor: "'Parisienne', cursive",
    tipo: 'script',
    descripcion: 'Caligrafía francesa, elegante y romántica para detalles',
    url: 'Parisienne',
  },
  {
    nombre: 'Alex Brush',
    valor: "'Alex Brush', cursive",
    tipo: 'script',
    descripcion: 'Cursiva fluida y sofisticada para nombres y títulos',
    url: 'Alex+Brush',
  },
  {
    nombre: 'Allura',
    valor: "'Allura', cursive",
    tipo: 'script',
    descripcion: 'Caligrafía elegante con un toque moderno',
    url: 'Allura',
  },

  // === SANS-SERIF (Modernas) - EXISTENTES ===
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
  // === NUEVAS SANS-SERIF ===
  {
    nombre: 'Josefin Sans',
    valor: "'Josefin Sans', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Geométrica y elegante, ideal para bodas modernas',
    url: 'Josefin+Sans:wght@300;400;600;700',
  },
  {
    nombre: 'Work Sans',
    valor: "'Work Sans', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Limpia y profesional con un toque de calidez',
    url: 'Work+Sans:wght@300;400;500;600;700',
  },
  {
    nombre: 'Poppins',
    valor: "'Poppins', 'Helvetica Neue', sans-serif",
    tipo: 'sans-serif',
    descripcion: 'Versátil y moderna, excelente legibilidad',
    url: 'Poppins:wght@300;400;500;600;700',
  },

  // === DISPLAY (Decorativas) - EXISTENTES ===
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
  // === NUEVAS DISPLAY ===
  {
    nombre: 'Cinzel Decorative',
    valor: "'Cinzel Decorative', Georgia, serif",
    tipo: 'display',
    descripcion:
      'Decorativa con estilo medieval, perfecta para eventos temáticos',
    url: 'Cinzel+Decorative:wght@400;700',
  },
  {
    nombre: 'Fredericka the Great',
    valor: "'Fredericka the Great', Georgia, serif",
    tipo: 'display',
    descripcion: 'Estilo vintage y divertido para cumpleaños',
    url: 'Fredericka+the+Great',
  },
  {
    nombre: 'Tienne',
    valor: "'Tienne', Georgia, serif",
    tipo: 'display',
    descripcion: 'Serif robusta con carácter para títulos',
    url: 'Tienne:wght@400;700;900',
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
