// src/app/models/animaciones.model.ts

export interface AnimacionHero {
  valor: string;
  nombre: string;
  descripcion: string;
  efecto: string; // Clase CSS que se aplicará
}

export const ANIMACIONES_HERO: AnimacionHero[] = [
  {
    valor: 'shimmer',
    nombre: '✨ Brillo',
    descripcion: 'Efecto de luz que se desplaza sobre el texto',
    efecto: 'animacion-shimmer',
  },
  {
    valor: 'gradient',
    nombre: '🌈 Gradiente',
    descripcion: 'Colores que se mezclan suavemente',
    efecto: 'animacion-gradient',
  },
  {
    valor: 'typing',
    nombre: '⌨️ Máquina de escribir',
    descripcion: 'Las letras aparecen una por una',
    efecto: 'animacion-typing',
  },
  {
    valor: 'neon',
    nombre: '💡 Neón',
    descripcion: 'Efecto de luz brillante como neón',
    efecto: 'animacion-neon',
  },
  {
    valor: 'fade',
    nombre: '🌊 Desvanecer',
    descripcion: 'El texto aparece con un efecto de desvanecimiento',
    efecto: 'animacion-fade',
  },
  {
    valor: 'scale',
    nombre: '🔍 Zoom',
    descripcion: 'El texto crece desde el centro',
    efecto: 'animacion-scale',
  },
  {
    valor: 'glitch',
    nombre: '📺 Glitch',
    descripcion: 'Efecto de error digital',
    efecto: 'animacion-glitch',
  },
  {
    valor: 'float',
    nombre: '☁️ Flotante',
    descripcion: 'El texto se eleva suavemente',
    efecto: 'animacion-float',
  },
];
