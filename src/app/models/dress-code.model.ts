// 👇 Tipos para el estilo de vestimenta
export type EstiloDressCode =
  | 'elegante'
  | 'formal'
  | 'semi-formal'
  | 'casual-elegante'
  | 'boho'
  | 'playa';

// 👇 Definición de cada estilo
export interface EstiloInfo {
  valor: EstiloDressCode;
  nombre: string;
  icon: string;
  descripcion: string;
}

// 👇 Estilos disponibles (para usar en el formulario)
export const ESTILOS_DISPONIBLES: EstiloInfo[] = [
  {
    valor: 'elegante',
    nombre: 'Elegante',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784697496/image-HgNpswLZWoAA75mtg7lu2SuS59K5Ik_frhylr.png',
    descripcion:
      'Traje oscuro o esmoquin para él, vestido largo o cóctel para ella.',
  },
  {
    valor: 'formal',
    nombre: 'Formal',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784697564/image-2eSeYYzqWreheiRapgbvisjDzfCpTj_lpkwbg.png',
    descripcion: 'Traje formal, corbata o moño. Vestido de gala o largo.',
  },
  {
    valor: 'semi-formal',
    nombre: 'Semi formal',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784697769/image-WwjASoY0i0QwhEgRJ7Qiu5Eg3KC7Jl_pl6xbv.png',
    descripcion:
      'Traje sin corbata o chaqueta con pantalón. Vestido midi o corto elegante.',
  },
  {
    valor: 'casual-elegante',
    nombre: 'Casual elegante',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784698058/image-jNFNutQXA079LwSjmfwJeFsid37vkh_pcmq5b.png',
    descripcion:
      'Pantalón de vestir con camisa, sin corbata. Vestido casual pero arreglado.',
  },
  {
    valor: 'boho',
    nombre: 'Boho',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784698001/image-vj66vaIm4eiP6G8ScBDDhegwh9ck0Z_bq2gby.png',
    descripcion:
      'Estilo bohemio, colores tierra, telas fluidas y accesorios naturales.',
  },
  {
    valor: 'playa',
    nombre: 'Playa',
    icon: 'https://res.cloudinary.com/drsyb53ae/image/upload/v1784696328/image-em0QUIsW2K1AYeCtbpxuUniDkcARay_qjt6ep.png',
    descripcion:
      'Ropa ligera, colores claros, telas frescas. Ideal para eventos al aire libre.',
  },
];

// 👇 Colores sugeridos predefinidos (paleta)
export const COLORES_DISPONIBLES: string[] = [
  '#E8D5B7', // Beige
  '#D4A574', // Oro
  '#C9A87C', // Bronce
  '#8B7355', // Marrón
  '#5C3D2E', // Café
  '#2B2B2B', // Negro
  '#3D5A80', // Azul marino
  '#8A78A6', // Lila
  '#D8A7A7', // Rosa
  '#F3D9D9', // Rosa claro
  '#DCC7A1', // Champagne
  '#E6DDF8', // Lavanda
  '#F5F5F5', // Blanco
  '#C8B6FF', // Lila claro
  '#D4AF37', // Oro brillante
  '#C9A227', // Mostaza
  '#7A8B7D', // Verde cemento
  '#B08A4A', // Dorado
];

// 👇 Interface para el Dress Code (para usar en InvitacionCompleta)
export interface DressCode {
  estilo: string; // Permitir string vacío para "no seleccionado"
  coloresReservados: string[];
  colores: string[];
  titulo: string;
  descripcion: string;
  sugerencia: string;
  notaAdicional: string;
}

// 👇 Función helper para obtener el nombre del estilo
export function getEstiloNombre(estilo: string): string {
  if (!estilo) return '';
  const encontrado = ESTILOS_DISPONIBLES.find((e) => e.valor === estilo);
  return encontrado?.nombre || estilo;
}

export function getEstiloIcon(estilo: string): string {
  if (!estilo) return '';
  const encontrado = ESTILOS_DISPONIBLES.find((e) => e.valor === estilo);
  return encontrado?.icon || '';
}

export function getEstiloDescripcion(estilo: string): string {
  if (!estilo) return '';
  const encontrado = ESTILOS_DISPONIBLES.find((e) => e.valor === estilo);
  return encontrado?.descripcion || '';
}
