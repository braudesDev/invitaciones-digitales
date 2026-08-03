// src/app/models/paleta.model.ts

// ================================================================
// INTERFAZ: Paleta de Colores
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
export const PALETAS_PREMIUM: { [key: string]: Paleta } = {
  // 1. AZUL ACERO - Elegante y profesional
  steel: {
    primary: '#054a91', // Azul profundo para títulos
    secondary: '#dbe4ee', // Azul claro para fondos
    accent: '#81a4cd', // Azul medio para botones
    text: '#2b2d42', // Texto oscuro
  },

  // 2. ROSA TERRACOTA - Romántico y cálido
  rose: {
    primary: '#5d2e46', // Vino oscuro para títulos
    secondary: '#f3d8c7', // Crema rosado para fondos
    accent: '#ad6a6c', // Terracota para botones
    text: '#3d1a2e', // Texto oscuro
  },

  // 3. OLIVA NATURAL - Orgánico y sereno
  olive: {
    primary: '#687351', // Verde oliva para títulos
    secondary: '#e8e4db', // Beige claro para fondos
    accent: '#9ba17f', // Verde suave para botones
    text: '#3d3d2b', // Texto oscuro
  },

  // 4. ACUARELA - Fresco y juvenil
  acuarela: {
    primary: '#5d8a8a', // Verde-azul para títulos
    secondary: '#faf3dd', // Crema para fondos
    accent: '#ffa69e', // Rosa coral para botones
    text: '#2d4a4a', // Texto oscuro
  },

  // 5. ÍNDIGO MODERNO - Sofisticado y moderno
  indigo: {
    primary: '#2b2d42', // Índigo para títulos
    secondary: '#edf2f4', // Blanco grisáceo para fondos
    accent: '#ef233c', // Rojo vibrante para botones
    text: '#1a1a2e', // Texto oscuro
  },

  // 6. LINO ELEGANTE - Clásico y atemporal
  lino: {
    primary: '#5d3a2a', // Café oscuro para títulos
    secondary: '#fbfefb', // Blanco para fondos
    accent: '#d0b8ac', // Beige rosado para botones
    text: '#3d2a1a', // Texto oscuro
  },

  // 7. CARBÓN - Minimalista y audaz
  carbon: {
    primary: '#252422', // Negro para títulos
    secondary: '#fffcf2', // Blanco roto para fondos
    accent: '#ccc5b9', // Gris cálido para botones
    text: '#1a1a1a', // Texto oscuro
  },

  // 8. CHAMPÁN - Luminoso y festivo
  champan: {
    primary: '#342a21', // Café oscuro para títulos
    secondary: '#f1e0c5', // Champán para fondos
    accent: '#c9b79c', // Beige dorado para botones
    text: '#2a201a', // Texto oscuro
  },

  // 9. PLATA - Moderno y fresco
  plata: {
    primary: '#4a6a7a', // Azul grisáceo para títulos
    secondary: '#fcfafa', // Blanco para fondos
    accent: '#a4b8c4', // Azul plata para botones
    text: '#2d4a5a', // Texto oscuro
  },

  // 10. MORADO POP - Divertido y vibrante
  morado: {
    primary: '#4a2a7a', // Púrpura oscuro para títulos
    secondary: '#f5edff', // Lila claro para fondos
    accent: '#6e44ff', // Morado vibrante para botones
    text: '#2a1a4a', // Texto oscuro
  },

  // 11. MENTA - Fresco y natural
  menta: {
    primary: '#243e36', // Verde oscuro para títulos
    secondary: '#f1f7ed', // Blanco menta para fondos
    accent: '#7ca982', // Verde menta para botones
    text: '#1a2e26', // Texto oscuro
  },

  // 12. JUNGLA - Exótico y vibrante
  jungla: {
    primary: '#2d4a3a', // Verde selva para títulos
    secondary: '#eaf4f4', // Turquesa claro para fondos
    accent: '#6b9080', // Verde teal para botones
    text: '#1a3a2a', // Texto oscuro
  },
  // 13. BODA REAL - Elegancia clásica
  bodaReal: {
    primary: '#8B1A4A', // Burdeos intenso para títulos
    secondary: '#FDF5F0', // Crema suave para fondos
    accent: '#C9A84C', // Dorado para botones y detalles
    text: '#3D1A2E', // Texto oscuro
  },

  // 14. BODA CAMPESTRE - Natural y romántico
  bodaCampestre: {
    primary: '#4A6B3A', // Verde bosque para títulos
    secondary: '#FFF8F0', // Beige floral para fondos
    accent: '#E8A87C', // Durazno para botones
    text: '#2D3A1A', // Texto oscuro
  },

  // 15. XV PRINCESA - Dulce y femenino
  xvPrincesa: {
    primary: '#C44A7A', // Rosa empolvado para títulos
    secondary: '#FFF5F8', // Blanco rosado para fondos
    accent: '#D4A0B0', // Rosa suave para botones
    text: '#4A2A3A', // Texto oscuro
  },

  // 16. BODA PLAYA - Fresco y luminoso
  bodaPlaya: {
    primary: '#2A7A8A', // Azul turquesa para títulos
    secondary: '#F0FAFF', // Blanco marino para fondos
    accent: '#F4A460', // Coral para botones
    text: '#1A4A5A', // Texto oscuro
  },

  // 17. XV ELEGANTE - Sofisticado y moderno
  xvElegante: {
    primary: '#2A2A4A', // Azul noche para títulos
    secondary: '#F8F5FF', // Lila claro para fondos
    accent: '#B8A0D0', // Lila plata para botones
    text: '#1A1A3A', // Texto oscuro
  },

  // 18. BODA RÚSTICA - Cálido y acogedor
  bodaRustica: {
    primary: '#6A4A2A', // Café oscuro para títulos
    secondary: '#FFF5EA', // Crema cálido para fondos
    accent: '#D4A050', // Mostaza para botones
    text: '#3A2A1A', // Texto oscuro
  },

  // 19. XV GLAMOUR - Lujoso y festivo
  xvGlamour: {
    primary: '#2A1A3A', // Púrpura noche para títulos
    secondary: '#FFF8FA', // Rosa champagne para fondos
    accent: '#D4AF37', // Oro brillante para botones
    text: '#1A0A2A', // Texto oscuro
  },

  // 20. BODA BOHO - Bohemio y libre
  bodaBoho: {
    primary: '#5A4A3A', // Marrón terracota para títulos
    secondary: '#FFFCF5', // Blanco roto para fondos
    accent: '#C9A87C', // Beige dorado para botones
    text: '#3A2A1A', // Texto oscuro
  },
};
