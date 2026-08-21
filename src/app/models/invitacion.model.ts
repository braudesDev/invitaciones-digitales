// src/app/models/invitacion.model.ts

import { PadrinoAsignado } from './padrino.model';
import { Regalos } from './regalos.model';
import { Confirmacion } from './confirmacion.model';
import { Consideraciones } from './consideraciones.model';
import { Contador } from './contador.model';
import { AudioConfig } from './audio.model';

// ================================================================
// INTERFAZ: Invitación Completa
// ================================================================
// Define la estructura completa de una invitación con todos sus
// campos y secciones.
// ================================================================
export interface InvitacionCompleta {
  id?: string; // ID opcional (Firebase)
  name: string; // Nombre del evento (obligatorio)
  slug: string; // URL amigable (ej: mi-boda)
  tipo: string; // Tipo: boda, xv, cumpleaños
  nombres: string; // Nombres del festejado(s)
  fecha: any; // Fecha y hora del evento
  lugar: string; // Ubicación del evento
  heroImage?: string; // Imagen principal (opcional)
  primaryColor: string; // Color principal (hex)
  secondaryColor: string; // Color secundario (hex)
  accentColor: string; // Color de acento (hex)
  textColor: string; // Color de texto (hex)
  fontFamily: string; // Fuente tipográfica
  frasePrincipal?: string; // Frase destacada
  mensajePrincipal?: string; // Mensaje descriptivo

  // --- Secciones ---
  historia?: {
    mostrarSeccion: boolean;
    estilo: 'timeline' | 'tarjetas' | 'album' | 'minimalista';
    titulo: string;
    descripcion: string;
    momentos: { fecha: string; descripcion: string; imagen?: string }[];
  };

  photos: string[]; // Fotos antiguas (deprecado)
  anfitrionId?: string; // ID del anfitrión (usuario)

  ceremonia: {
    lugar: string;
    direccion: string;
    hora: string;
    mapaUrl?: string;
    imagenTemplo?: string;
  };

  recepcion: {
    lugar: string;
    direccion: string;
    hora: string;
    mapaUrl?: string;
    imagen?: string;
    descripcion?: string;
  };

  dressCode: {
    estilo: string;
    colores: string[];
    coloresReservados: string[];
    titulo: string;
    descripcion: string;
    sugerencia: string;
    notaAdicional: string;
  };

  padres: {
    padreNovia: string;
    madreNovia: string;
    padreNovio: string;
    madreNovio: string;
    novio?: string;
    novia?: string;
    // ✅ NUEVOS CAMPOS: indicar si fallecieron
    madreNoviaFallecida?: boolean;
    padreNoviaFallecido?: boolean;
    madreNovioFallecida?: boolean;
    padreNovioFallecido?: boolean;
  };

  padrinos: PadrinoAsignado[];
  regalos: Regalos;

  confirmacion: {
    telefono: string;
    whatsapp: string;
    link: string;
  };

  confirmacionData?: Confirmacion;
  hashtag: {
    titulo: string; // "HASHTAG"
    subtitulo: string; // "Comparte tus momentos"
    hashtag: string; // "#MarianaYAlejandro"
    mensaje: string; // Mensaje principal
    icono: string; // "fas fa-hashtag"
    mostrarIcono: boolean; // true/false
    resaltarHashtag: boolean; // true/false
    mostrarCaracteristicas: boolean; // true/false
  };
  consideracionesData?: Consideraciones;

  hospedaje?: {
    mostrarSeccion: boolean;
    estilo: 'tarjetas' | 'timeline' | 'catalogo' | 'iconos' | 'mosaico';
    titulo: string;
    descripcion: string;
    alojamientos: {
      titulo: string;
      ubicacion: string;
      enlace: string;
      imagen?: string;
      capacidad?: string;
      distancia?: string;
    }[];
    textoBoton: string;
    textoAdicional: string;
  };

  galeria?: {
    mostrarSeccion: boolean;
    titulo: string;
    subtitulo?: string;
    descripcion: string;
    fotos: {
      url: string;
      titulo?: string;
      descripcion?: string;
      destacada?: boolean;
    }[];
    estilo: 'grid' | 'masonry' | 'carousel' | 'album' | 'slideshow';
    efecto: 'slide' | 'fade' | 'zoom';
    velocidad: number;
    mostrarControles: boolean;
    mostrarCompartir: boolean;
    mostrarPaginacion: boolean;
  };

  contador?: Contador;
  itinerario?: any; // Puedes tiparlo mejor si tienes el modelo

  animacionHero?: string; // Animación seleccionada para el Hero Section

  orientacionImagen?: string; // 'horizontal' | 'vertical' | 'auto'

  heroImageMovil?: string; // Imagen para móvil (vertical)
  heroImageEscritorio?: string; // Imagen para escritorio (horizontal)

  audio?: AudioConfig;
}
