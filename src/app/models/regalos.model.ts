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

  // ✅ NUEVOS CAMPOS PARA TRANSFERENCIAS BANCARIAS
  cuenta?: string; // Número de cuenta o CLABE
  tipoCuenta?: 'clabe' | 'cuenta' | 'tarjeta'; // Tipo de cuenta
  mostrarCopiar?: boolean; // Si muestra el botón copiar (por defecto true si hay cuenta)
}

export const ESTILOS_REGALOS = [
  { valor: 'tarjetas', nombre: 'Tarjetas', icon: 'heroSquares2x2' },
  { valor: 'timeline', nombre: 'Timeline', icon: 'heroClock' },
  { valor: 'catalogo', nombre: 'Catálogo', icon: 'heroBookOpen' },
  { valor: 'iconos', nombre: 'Íconos', icon: 'heroTag' },
  { valor: 'mosaico', nombre: 'Mosaico', icon: 'heroSquaresPlus' },
];

// 👇 AYUDA PARA EL USUARIO - EJEMPLOS DE OPCIONES
export const EJEMPLOS_OPCIONES_REGALOS = [
  {
    nombre: 'Liverpool',
    subtitulo: 'Evento #589632',
    icono: 'heroBuildingOffice',
    url: 'https://www.liverpool.com.mx/lista-de-deseos/...',
    descripcion: 'Lista de deseos en Liverpool',
  },
  {
    nombre: 'Amazon',
    subtitulo: 'Lista de deseos',
    icono: 'heroCube',
    url: 'https://www.amazon.com.mx/registro/...',
    descripcion: 'Lista de deseos en Amazon',
  },
  {
    nombre: 'Lluvia de sobres',
    subtitulo: 'Gracias por su cariño',
    icono: 'heroBanknotes',
    url: '',
    descripcion: 'Sobres con dinero en efectivo el día del evento',
  },
  {
    nombre: 'Transferencia bancaria',
    subtitulo: 'Banco Azteca',
    icono: 'lucideBanknoteArrowUp',
    url: '',
    cuenta: '123456789012345678', // ✅ CLABE
    tipoCuenta: 'clabe',
    mostrarCopiar: true,
    descripcion: 'CLABE para transferencia bancaria',
  },
  {
    nombre: 'BBVA',
    subtitulo: 'Cuenta de ahorros',
    icono: 'heroBuildingOffice',
    url: 'https://www.bbva.mx/',
    cuenta: '0123456789',
    tipoCuenta: 'cuenta',
    mostrarCopiar: true,
    descripcion: 'Número de cuenta BBVA',
  },
];
