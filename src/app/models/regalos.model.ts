// src/app/models/regalos.model.ts

export interface Regalos {
  mostrarSeccion: boolean;
  estilo: 'tarjetas' | 'timeline' | 'catalogo' | 'iconos' | 'mosaico';
  titulo: string;
  descripcion: string;
  opciones: OpcionRegalo[];
  textoBoton: string;
}

export interface OpcionRegalo {
  nombre: string;
  subtitulo: string;
  icono?: string;
  url?: string; // 👈 Campo para URL
}

export const ESTILOS_REGALOS = [
  { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
  { valor: 'timeline', nombre: 'Timeline', icon: '📅' },
  { valor: 'catalogo', nombre: 'Catálogo', icon: '📖' },
  { valor: 'iconos', nombre: 'Íconos', icon: '🎯' },
  { valor: 'mosaico', nombre: 'Mosaico', icon: '🧩' },
];

// 👇 AYUDA PARA EL USUARIO - EJEMPLOS DE OPCIONES
export const EJEMPLOS_OPCIONES_REGALOS = [
  {
    nombre: 'Liverpool',
    subtitulo: 'Evento #589632',
    icono: '🏬',
    url: 'https://www.liverpool.com.mx/lista-de-deseos/...',
    descripcion: 'Lista de deseos en Liverpool',
  },
  {
    nombre: 'Amazon',
    subtitulo: 'Lista de deseos',
    icono: '📦',
    url: 'https://www.amazon.com.mx/registro/...',
    descripcion: 'Lista de deseos en Amazon',
  },
  {
    nombre: 'Lluvia de sobres',
    subtitulo: 'Gracias por su cariño',
    icono: '💵',
    url: '',
    descripcion: 'Sobres con dinero en efectivo el día del evento',
  },
  {
    nombre: 'Transferencia bancaria',
    subtitulo: 'Ver datos bancarios',
    icono: '🏦',
    url: '',
    descripcion: 'CLABE o cuenta bancaria para transferencia',
  },
];
