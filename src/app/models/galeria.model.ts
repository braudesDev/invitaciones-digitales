export interface Foto {
  url: string;
  titulo?: string;
  descripcion?: string;
  destacada?: boolean;
}

export type EstiloGaleria =
  | 'grid'
  | 'masonry'
  | 'carousel'
  | 'album'
  | 'slideshow';

export interface Galeria {
  mostrarSeccion: boolean;
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  fotos: Foto[];
  estilo: EstiloGaleria;
  efecto: 'slide' | 'fade' | 'zoom';
  velocidad: number;
  mostrarControles: boolean;
  mostrarCompartir: boolean;
  mostrarPaginacion: boolean;
}
