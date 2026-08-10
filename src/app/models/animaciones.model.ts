// src/app/models/animaciones.model.ts

export interface AnimacionHero {
  valor: string;
  nombre: string;
  descripcion: string;
  efecto: string; // Clase CSS que se aplicará
  icono: string;
}

export const ANIMACIONES_HERO: AnimacionHero[] = [
  {
    valor: 'shimmer',
    nombre: 'Brillo',
    descripcion: 'Efecto de luz que se desplaza sobre el texto',
    efecto: 'animacion-shimmer',
    icono: 'lucideSparkles', // ✨
  },
  {
    valor: 'gradient',
    nombre: 'Gradiente',
    descripcion: 'Colores que se mezclan suavemente',
    efecto: 'animacion-gradient',
    icono: 'hugeRainbow', // 🌈
  },
  {
    valor: 'typing',
    nombre: 'Máquina de escribir',
    descripcion: 'Las letras aparecen una por una',
    efecto: 'animacion-typing',
    icono: 'heroPencil', // ⌨️
  },
  {
    valor: 'neon',
    nombre: 'Neón',
    descripcion: 'Efecto de luz brillante como neón',
    efecto: 'animacion-neon',
    icono: 'hugeBulb', // 💡
  },
  {
    valor: 'fade',
    nombre: 'Desvanecer',
    descripcion: 'El texto aparece con un efecto de desvanecimiento',
    efecto: 'animacion-fade',
    icono: 'lucideCloud', // 🌊
  },
  {
    valor: 'scale',
    nombre: 'Zoom',
    descripcion: 'El texto crece desde el centro',
    efecto: 'animacion-scale',
    icono: 'heroMagnifyingGlass', // 🔍
  },
  {
    valor: 'glitch',
    nombre: 'Glitch',
    descripcion: 'Efecto de error digital',
    efecto: 'animacion-glitch',
    icono: 'heroBolt', // 📺
  },
  {
    valor: 'float',
    nombre: 'Flotante',
    descripcion: 'El texto se eleva suavemente',
    efecto: 'animacion-float',
    icono: 'lucideFeather', // ☁️
  },
];
