// src/app/models/paleta.model.ts

// ================================================================
// INTERFAZ: Paleta de Colores
// ================================================================
// Define la estructura de una paleta de colores premium
// ================================================================
export interface Paleta {
  primary: string; // Color principal
  secondary: string; // Color secundario
  accent: string; // Color de acento
  text: string; // Color de texto
}

// ================================================================
// PALETAS DE COLORES PREMIUM
// ================================================================
// 6 paletas predefinidas con combinaciones de colores profesionales
// ================================================================
export const PALETAS_PREMIUM: { [key: string]: Paleta } = {
  premium: {
    // Verde Cemento + Oro
    primary: '#7A8B7D',
    secondary: '#CBB89D',
    accent: '#B08A4A',
    text: '#3F4A42',
  },
  champagne: {
    // Champagne + Dorado
    primary: '#DCC7A1',
    secondary: '#F3E9D2',
    accent: '#B8934E',
    text: '#4E463B',
  },
  rosegold: {
    // Rose Gold
    primary: '#D8A7A7',
    secondary: '#F3D9D9',
    accent: '#B76E79',
    text: '#5F4A4A',
  },
  lavender: {
    // Lavanda Real
    primary: '#8A78A6',
    secondary: '#E6DDF8',
    accent: '#C8B6FF',
    text: '#4F4662',
  },
  royal: {
    // Azul Royal
    primary: '#3D5A80',
    secondary: '#E6EEF7',
    accent: '#D4AF37',
    text: '#243447',
  },
  black: {
    // Black Luxury
    primary: '#2B2B2B',
    secondary: '#F5F5F5',
    accent: '#C9A227',
    text: '#333333',
  },
};
