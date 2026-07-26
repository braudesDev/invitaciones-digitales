import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload';
import {
  PadrinoAsignado,
  ROLES_PADrinos,
  TipoRolPadrino,
  getRolesPorEvento,
} from '../../../models/padrino.model';
import {
  ESTILOS_DISPONIBLES,
  COLORES_DISPONIBLES,
  DressCode,
  getEstiloNombre,
  getEstiloIcon,
  getEstiloDescripcion,
} from '../../../models/dress-code.model';

export interface InvitacionCompleta {
  id?: string;
  name: string;
  slug: string;
  tipo: string;
  nombres: string;
  fecha: any;
  lugar: string;
  heroImage?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  frasePrincipal?: string;
  mensajePrincipal?: string;
  historia?: {
    mostrarSeccion: boolean;
    estilo: 'timeline' | 'tarjetas' | 'album' | 'minimalista';
    titulo: string;
    descripcion: string;
    momentos: { fecha: string; descripcion: string; imagen?: string }[];
  };
  photos: string[];
  anfitrionId?: string;
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
    estilo: string; // Nuevo campo para el estilo del dress code
    colores: string[]; // Array de colores sugeridos
    coloresReservados: string[]; // Array de colores reservados
    titulo: string; // Título personalizado
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
  };
  // 👇 CAMBIAR: padrinos ahora es PadrinoAsignado[]
  padrinos: PadrinoAsignado[];
  regalos: { texto: string; links: { nombre: string; url: string }[] };
  confirmacion: { telefono: string; whatsapp: string; link: string };
  hashtag: string;
  consideraciones: string;
  //Hospedaje (opcional)
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
    descripcion: string;
    fotos: {
      url: string;
      titulo?: string;
      descripcion?: string;
      destacada?: boolean;
    }[];
    estilo: 'grid' | 'masonry' | 'carousel' | 'album' | 'slideshow';
    efecto: 'slide' | 'fade' | 'zoom' | 'flip';
    velocidad: number;
    mostrarControles: boolean;
    mostrarCompartir: boolean;
    mostrarPaginacion: boolean;
  };
}

interface Paleta {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

@Component({
  selector: 'app-formulario-invitacion',
  standalone: true,
  imports: [FormsModule, ImageUploadComponent],
  templateUrl: './formulario-invitacion.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./formulario-invitacion.component.css'],
})
export class FormularioInvitacionComponent implements OnInit {
  paletas: { [key: string]: Paleta } = {
    premium: {
      primary: '#7A8B7D',
      secondary: '#CBB89D',
      accent: '#B08A4A',
      text: '#3F4A42',
    },
    champagne: {
      primary: '#DCC7A1',
      secondary: '#F3E9D2',
      accent: '#B8934E',
      text: '#4E463B',
    },
    rosegold: {
      primary: '#D8A7A7',
      secondary: '#F3D9D9',
      accent: '#B76E79',
      text: '#5F4A4A',
    },
    lavender: {
      primary: '#8A78A6',
      secondary: '#E6DDF8',
      accent: '#C8B6FF',
      text: '#4F4662',
    },
    royal: {
      primary: '#3D5A80',
      secondary: '#E6EEF7',
      accent: '#D4AF37',
      text: '#243447',
    },
    black: {
      primary: '#2B2B2B',
      secondary: '#F5F5F5',
      accent: '#C9A227',
      text: '#333333',
    },
  };
  paletaSeleccionada: string = '';

  aplicarPaleta(tipo: string) {
    const paleta = this.paletas[tipo];
    if (paleta) {
      this.paletaSeleccionada = tipo;
      this.nuevaInvitacion.primaryColor = paleta.primary;
      this.nuevaInvitacion.secondaryColor = paleta.secondary;
      this.nuevaInvitacion.accentColor = paleta.accent;
      this.nuevaInvitacion.textColor = paleta.text;
    }
  }
  invitacionId: string | null = null;
  cargando = false;
  tabActivo: 'basico' | 'ceremonia' | 'extras' = 'basico';

  // 👇 Estilos para hospedaje
  estilosHospedaje = [
    { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
    { valor: 'timeline', nombre: 'Timeline', icon: '📅' },
    { valor: 'catalogo', nombre: 'Catálogo', icon: '📖' },
    { valor: 'iconos', nombre: 'Íconos', icon: '🎯' },
    { valor: 'mosaico', nombre: 'Mosaico', icon: '🧩' },
  ];

  nuevaInvitacion: InvitacionCompleta = {
    name: '',
    slug: '',
    tipo: 'boda',
    nombres: '',
    fecha: new Date().toISOString().substring(0, 16),
    lugar: '',
    heroImage: '',
    primaryColor: '#7A8B7D',
    secondaryColor: '#CBB89D',
    accentColor: '#B08A4A',
    textColor: '#3F4A42',
    fontFamily: "'Playfair Display', serif",
    frasePrincipal: '',
    mensajePrincipal: '',
    historia: {
      mostrarSeccion: true,
      estilo: 'timeline',
      titulo: 'Nuestra Historia',
      descripcion: '',
      momentos: [],
    },
    photos: [],
    anfitrionId: '',
    ceremonia: {
      lugar: '',
      direccion: '',
      hora: '',
      mapaUrl: '',
      imagenTemplo: '',
    },
    recepcion: {
      lugar: '',
      direccion: '',
      hora: '',
      mapaUrl: '',
      imagen: '',
      descripcion: '',
    },
    dressCode: {
      estilo: '',
      colores: [],
      coloresReservados: [],
      titulo: '',
      descripcion: '',
      sugerencia: '',
      notaAdicional: '',
    },
    padres: {
      padreNovia: '',
      madreNovia: '',
      padreNovio: '',
      madreNovio: '',
      novio: '',
      novia: '',
    },
    padrinos: [], //
    regalos: { texto: '', links: [] },
    confirmacion: { telefono: '', whatsapp: '', link: '' },
    hashtag: '',
    consideraciones: '',
  };

  // Variables para acordeones (extras)
  acordeonAbierto = false;
  acordeonPadrinos = false;
  acordeonRegalos = false;
  acordeonGaleria = false;
  acordeonConfirmacion = false;
  acordeonConsideraciones = false;
  acordeonHashtag = false;
  acordeonDressCode = false;
  imagenSubiendo = false;
  acordeonHistoria = false;
  acordeonHospedaje = false;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private auth: Auth,
    private storage: Storage,
    private http: HttpClient,
  ) {}

  async ngOnInit() {
    this.invitacionId = this.route.snapshot.paramMap.get('id');
    if (this.invitacionId) {
      this.cargando = true;
      const ref = doc(this.firestore, `invitaciones/${this.invitacionId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Partial<InvitacionCompleta>;

        // 👇 CONVERTIR PADRINOS VIEJOS (string[]) A NUEVO FORMATO
        if (
          data.padrinos &&
          Array.isArray(data.padrinos) &&
          typeof data.padrinos[0] === 'string'
        ) {
          const padrinosViejos = data.padrinos as any as string[];
          data.padrinos = padrinosViejos.map((nombre) => ({
            nombre: nombre,
            rol: 'personalizado',
            observaciones: '',
          }));
        }
        //PROCESAR DRESS CODE PARA ASEGURAR QUE TODOS LOS CAMPOS ESTÉN PRESENTES
        if (data.dressCode) {
          if (!data.dressCode.colores) data.dressCode.colores = [];
          if (!data.dressCode.coloresReservados)
            data.dressCode.coloresReservados = [];
          if (!data.dressCode.titulo) data.dressCode.titulo = '';
          if (!data.dressCode.descripcion) data.dressCode.descripcion = '';
          if (!data.dressCode.sugerencia) data.dressCode.sugerencia = '';
          if (!data.dressCode.notaAdicional) data.dressCode.notaAdicional = '';
        }

        //PROCESAR HISTORIA PARA ASEGURAR QUE TODOS LOS CAMPOS ESTÉN PRESENTES
        if (data.historia) {
          // Si es string, convertirlo a objeto
          if (typeof data.historia === 'string') {
            data.historia = {
              mostrarSeccion: true,
              estilo: 'timeline',
              titulo: 'Nuestra Historia',
              descripcion: data.historia || '',
              momentos: [],
            };
          } else {
            // Si es objeto, asegurar que tenga todas las propiedades
            if (!data.historia.momentos) data.historia.momentos = [];
            if (!data.historia.titulo)
              data.historia.titulo = 'Nuestra Historia';
            if (!data.historia.estilo) data.historia.estilo = 'timeline';
            if (data.historia.mostrarSeccion === undefined)
              data.historia.mostrarSeccion = true;
            if (!data.historia.descripcion) data.historia.descripcion = '';
          }
        }

        this.nuevaInvitacion = {
          ...this.nuevaInvitacion,
          ...data,
          photos: data.photos || [],
          padrinos: data.padrinos || [],
        };

        this.detectarPaletaPorColores();
      }
      this.cargando = false;
    }
  }

  async subirImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Solo se permiten imágenes', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
      return;
    }

    this.imagenSubiendo = true;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'invitaciones-app');

      const cloudName = 'drsyb53ae';

      const response = await this.http
        .post<{
          secure_url: string;
        }>(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
        )
        .toPromise();

      if (response && response.secure_url) {
        this.nuevaInvitacion.heroImage = response.secure_url;
        Swal.fire('✅ Imagen subida correctamente', '', 'success');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    } finally {
      this.imagenSubiendo = false;
    }
  }

  // ============================================
  // 👇 MÉTODOS PARA PADRINOS (NUEVOS)
  // ============================================

  getRolesDisponibles(): string[] {
    return getRolesPorEvento(this.nuevaInvitacion.tipo);
  }

  getRolLabel(rolId: string): string {
    return ROLES_PADrinos[rolId as TipoRolPadrino]?.nombre || rolId;
  }

  getRolIcon(rolId: string): string {
    return ROLES_PADrinos[rolId as TipoRolPadrino]?.icon || '⭐';
  }

  getRolDescripcion(rolId: string): string {
    return ROLES_PADrinos[rolId as TipoRolPadrino]?.descripcion || '';
  }

  getPadrinosAgrupados(): { rolId: string; rol: string; nombres: string[] }[] {
    const grupos: { [key: string]: { nombres: string[] } } = {};

    this.nuevaInvitacion.padrinos.forEach((p) => {
      if (p.nombre && p.nombre.trim()) {
        if (!grupos[p.rol]) {
          grupos[p.rol] = { nombres: [] };
        }
        grupos[p.rol].nombres.push(p.nombre);
      }
    });

    return Object.entries(grupos).map(([rolId, data]) => ({
      rolId: rolId,
      rol: this.getRolLabel(rolId),
      nombres: data.nombres,
    }));
  }

  agregarPadrino() {
    const rolesDisponibles = this.getRolesDisponibles();
    this.nuevaInvitacion.padrinos.push({
      nombre: '',
      rol: rolesDisponibles.length > 0 ? rolesDisponibles[0] : 'personalizado',
      // observaciones: '',
    });
  }

  eliminarPadrino(index: number) {
    this.nuevaInvitacion.padrinos.splice(index, 1);
  }

  onRolChange(index: number) {
    // Opcional: Actualizar algo cuando cambia el rol
    console.log('Rol cambiado para padrino', index);
  }

  // ============================================
  // MÉTODOS EXISTENTES
  // ============================================

  agregarRegaloLink() {
    this.nuevaInvitacion.regalos.links.push({ nombre: '', url: '' });
  }

  eliminarRegaloLink(index: number) {
    this.nuevaInvitacion.regalos.links.splice(index, 1);
  }

  agregarFoto() {
    if (!this.nuevaInvitacion.photos) {
      this.nuevaInvitacion.photos = [];
    }
    this.nuevaInvitacion.photos.push('');
  }

  eliminarFoto(index: number) {
    this.nuevaInvitacion.photos?.splice(index, 1);
  }

  async guardarInvitacion() {
    if (!this.nuevaInvitacion.name || !this.nuevaInvitacion.fecha) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      Swal.fire(
        'Error',
        'Debes iniciar sesión para guardar la invitación',
        'error',
      );
      return;
    }

    // 👇 LIMPIAR PADRINOS VACÍOS
    const padrinosFiltrados = this.nuevaInvitacion.padrinos.filter(
      (p) => p.nombre && p.nombre.trim() !== '',
    );

    this.nuevaInvitacion.slug = this.nuevaInvitacion.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    const invitacionParaGuardar = {
      ...this.nuevaInvitacion,
      padrinos: padrinosFiltrados,
      anfitrionId: user.uid,
    };

    const ref = doc(
      this.firestore,
      `invitaciones/${this.nuevaInvitacion.slug}`,
    );

    try {
      await setDoc(ref, invitacionParaGuardar);
      Swal.fire('Éxito', 'Invitación guardada correctamente', 'success');

      // Resetear formulario
      this.nuevaInvitacion = {
        name: '',
        slug: '',
        tipo: 'boda',
        nombres: '',
        fecha: new Date().toISOString().substring(0, 16),
        lugar: '',
        heroImage: '',
        primaryColor: '#7A8B7D',
        secondaryColor: '#CBB89D',
        accentColor: '#B08A4A',
        textColor: '#3F4A42',
        fontFamily: "'Playfair Display', serif",
        frasePrincipal: '',
        mensajePrincipal: '',
        historia: {
          mostrarSeccion: true,
          estilo: 'timeline',
          titulo: 'Nuestra Historia',
          descripcion: '',
          momentos: [],
        },
        photos: [],
        anfitrionId: '',
        ceremonia: {
          lugar: '',
          direccion: '',
          hora: '',
          mapaUrl: '',
          imagenTemplo: '',
        },
        recepcion: {
          lugar: '',
          direccion: '',
          hora: '',
          mapaUrl: '',
          imagen: '',
          descripcion: '',
        },
        dressCode: {
          estilo: '',
          colores: [],
          coloresReservados: [],
          titulo: '',
          descripcion: '',
          sugerencia: '',
          notaAdicional: '',
        },
        padres: {
          padreNovia: '',
          madreNovia: '',
          padreNovio: '',
          madreNovio: '',
          novio: '',
          novia: '',
        },
        padrinos: [],
        regalos: { texto: '', links: [] },
        confirmacion: { telefono: '', whatsapp: '', link: '' },
        hashtag: '',
        consideraciones: '',
      };
      this.tabActivo = 'basico';
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  }

  detectarPaletaPorColores() {
    for (const [key, paleta] of Object.entries(this.paletas)) {
      if (
        paleta.primary === this.nuevaInvitacion.primaryColor &&
        paleta.secondary === this.nuevaInvitacion.secondaryColor &&
        paleta.accent === this.nuevaInvitacion.accentColor &&
        paleta.text === this.nuevaInvitacion.textColor
      ) {
        this.paletaSeleccionada = key;
        return;
      }
    }
    this.paletaSeleccionada = '';
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  // 👇 Definir estilos y colores (usando los imports del modelo)
  estilosDisponibles = ESTILOS_DISPONIBLES;
  coloresDisponibles = COLORES_DISPONIBLES;

  // 👇 Métodos helper para el Dress Code
  getEstiloNombre = getEstiloNombre;
  getEstiloIcon = getEstiloIcon;
  getEstiloDescripcion = getEstiloDescripcion;

  // 👇 Verificar si un color está seleccionado
  isColorSelected(color: string): boolean {
    return this.nuevaInvitacion.dressCode.colores?.includes(color) || false;
  }

  // 👇 Alternar selección de color
  toggleColor(color: string): void {
    if (!this.nuevaInvitacion.dressCode.colores) {
      this.nuevaInvitacion.dressCode.colores = [];
    }

    const index = this.nuevaInvitacion.dressCode.colores.indexOf(color);
    if (index > -1) {
      this.nuevaInvitacion.dressCode.colores.splice(index, 1);
    } else {
      if (this.nuevaInvitacion.dressCode.colores.length < 4) {
        this.nuevaInvitacion.dressCode.colores.push(color);
      } else {
        Swal.fire(
          'Máximo 4 colores',
          'Puedes seleccionar hasta 4 colores sugeridos',
          'warning',
        );
      }
    }
  }

  // 👇 Eliminar color de la selección
  removeColor(color: string): void {
    const index = this.nuevaInvitacion.dressCode.colores.indexOf(color);
    if (index > -1) {
      this.nuevaInvitacion.dressCode.colores.splice(index, 1);
    }
  }

  // 👇 Método para contar caracteres (usar en el template)
  getContador(texto: string | undefined, max: number): string {
    const length = texto?.length || 0;
    return `${length}/${max}`;
  }

  isColorReservado(color: string): boolean {
    return (
      this.nuevaInvitacion.dressCode.coloresReservados?.includes(color) || false
    );
  }

  // Alternar selección de color reservado
  toggleColorReservado(color: string): void {
    if (!this.nuevaInvitacion.dressCode.coloresReservados) {
      this.nuevaInvitacion.dressCode.coloresReservados = [];
    }

    const index =
      this.nuevaInvitacion.dressCode.coloresReservados.indexOf(color);
    if (index > -1) {
      this.nuevaInvitacion.dressCode.coloresReservados.splice(index, 1);
    } else {
      if (this.nuevaInvitacion.dressCode.coloresReservados.length < 4) {
        this.nuevaInvitacion.dressCode.coloresReservados.push(color);
      } else {
        Swal.fire(
          'Máximo 4 colores',
          'Puedes seleccionar hasta 4 colores reservados',
          'warning',
        );
      }
    }
  }

  // Eliminar color reservado
  removeColorReservado(color: string): void {
    const index =
      this.nuevaInvitacion.dressCode.coloresReservados.indexOf(color);
    if (index > -1) {
      this.nuevaInvitacion.dressCode.coloresReservados.splice(index, 1);
    }
  }

  estilosHistoria = [
    { valor: 'timeline', nombre: 'Línea de tiempo', icon: '📅' },
    { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
    { valor: 'album', nombre: 'Álbum', icon: '📸' },
    { valor: 'minimalista', nombre: 'Minimalista', icon: '✨' },
  ];

  // 👇 Métodos para momentos
  agregarMomento() {
    if (!this.nuevaInvitacion.historia) {
      this.nuevaInvitacion.historia = {
        mostrarSeccion: true,
        estilo: 'timeline',
        titulo: 'Nuestra Historia',
        descripcion: '',
        momentos: [],
      };
    }
    this.nuevaInvitacion.historia.momentos.push({
      fecha: '',
      descripcion: '',
      imagen: '',
    });
  }

  toggleMostrarHistoria() {
    if (!this.nuevaInvitacion.historia) {
      this.nuevaInvitacion.historia = {
        mostrarSeccion: true,
        estilo: 'timeline',
        titulo: 'Nuestra Historia',
        descripcion: '',
        momentos: [],
      };
    }
    this.nuevaInvitacion.historia.mostrarSeccion =
      !this.nuevaInvitacion.historia.mostrarSeccion;
  }

  seleccionarEstiloHistoria(estilo: string) {
    if (!this.nuevaInvitacion.historia) {
      this.nuevaInvitacion.historia = {
        mostrarSeccion: true,
        estilo: 'timeline',
        titulo: 'Nuestra Historia',
        descripcion: '',
        momentos: [],
      };
    }
    // ✅ Forzar el tipo con as
    this.nuevaInvitacion.historia.estilo = estilo as
      | 'timeline'
      | 'tarjetas'
      | 'album'
      | 'minimalista';
  }

  get historiaMomentos(): any[] {
    return this.nuevaInvitacion.historia?.momentos || [];
  }

  // 👇 Getter para el título
  get historiaTitulo(): string {
    return this.nuevaInvitacion.historia?.titulo || '';
  }

  // 👇 Setter para el título
  set historiaTitulo(value: string) {
    if (!this.nuevaInvitacion.historia) {
      this.nuevaInvitacion.historia = {
        mostrarSeccion: true,
        estilo: 'timeline',
        titulo: 'Nuestra Historia',
        descripcion: '',
        momentos: [],
      };
    }
    this.nuevaInvitacion.historia.titulo = value;
  }

  // 👇 Getter para descripción
  get historiaDescripcion(): string {
    return this.nuevaInvitacion.historia?.descripcion || '';
  }

  // 👇 Setter para descripción
  set historiaDescripcion(value: string) {
    if (!this.nuevaInvitacion.historia) {
      this.nuevaInvitacion.historia = {
        mostrarSeccion: true,
        estilo: 'timeline',
        titulo: 'Nuestra Historia',
        descripcion: '',
        momentos: [],
      };
    }
    this.nuevaInvitacion.historia.descripcion = value;
  }

  // 👇 Getter/Setter para mostrarSeccion
  get historiaMostrarSeccion(): boolean {
    return this.nuevaInvitacion.historia?.mostrarSeccion ?? true;
  }

  set historiaMostrarSeccion(value: boolean) {
    if (!this.nuevaInvitacion.historia) {
      this.nuevaInvitacion.historia = {
        mostrarSeccion: true,
        estilo: 'timeline',
        titulo: 'Nuestra Historia',
        descripcion: '',
        momentos: [],
      };
    }
    this.nuevaInvitacion.historia.mostrarSeccion = value;
  }

  // ✅ Versión mejorada (más segura)
  eliminarMomento(index: number) {
    if (this.nuevaInvitacion.historia?.momentos) {
      this.nuevaInvitacion.historia.momentos.splice(index, 1);
    }
  }

  //Getters para hospedaje
  get hospedajeTitulo(): string {
    return this.nuevaInvitacion.hospedaje?.titulo || '';
  }

  set hospedajeTitulo(value: string) {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.titulo = value;
  }

  get hospedajeDescripcion(): string {
    return this.nuevaInvitacion.hospedaje?.descripcion || '';
  }

  set hospedajeDescripcion(value: string) {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.descripcion = value;
  }

  get hospedajeMostrarSeccion(): boolean {
    return this.nuevaInvitacion.hospedaje?.mostrarSeccion ?? false;
  }

  set hospedajeMostrarSeccion(value: boolean) {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.mostrarSeccion = value;
  }

  get hospedajeTextoBoton(): string {
    return this.nuevaInvitacion.hospedaje?.textoBoton || 'Ver en Airbnb';
  }

  set hospedajeTextoBoton(value: string) {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.textoBoton = value;
  }

  get hospedajeTextoAdicional(): string {
    return this.nuevaInvitacion.hospedaje?.textoAdicional || '';
  }

  set hospedajeTextoAdicional(value: string) {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.textoAdicional = value;
  }

  get hospedajeAlojamientos(): any[] {
    return this.nuevaInvitacion.hospedaje?.alojamientos || [];
  }

  // 👇 Métodos para alojamientos
  agregarAlojamiento() {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.alojamientos.push({
      titulo: '',
      ubicacion: '',
      enlace: '',
      imagen: '',
      capacidad: '',
      distancia: '',
    });
  }

  eliminarAlojamiento(index: number) {
    if (this.nuevaInvitacion.hospedaje?.alojamientos) {
      this.nuevaInvitacion.hospedaje.alojamientos.splice(index, 1);
    }
  }

  seleccionarEstiloHospedaje(estilo: string) {
    if (!this.nuevaInvitacion.hospedaje) {
      this.nuevaInvitacion.hospedaje = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Hospedaje Airbnb',
        descripcion: '',
        alojamientos: [],
        textoBoton: 'Ver en Airbnb',
        textoAdicional: '',
      };
    }
    this.nuevaInvitacion.hospedaje.estilo = estilo as any;
  }

  estilosGaleria = [
    { valor: 'grid', nombre: 'Grid', icon: '📐' },
    { valor: 'masonry', nombre: 'Masonry', icon: '🧱' },
    { valor: 'carousel', nombre: 'Carrusel', icon: '🎠' },
    { valor: 'album', nombre: 'Álbum', icon: '📖' },
    { valor: 'slideshow', nombre: 'Presentación', icon: '🎬' },
  ];

  // 👇 Efectos para galería
  efectosGaleria = [
    { valor: 'slide', nombre: 'Deslizar', icon: '➡️' },
    { valor: 'fade', nombre: 'Desvanecer', icon: '🌫️' },
    { valor: 'zoom', nombre: 'Zoom', icon: '🔍' },
    { valor: 'flip', nombre: 'Voltear', icon: '🔄' },
  ];

  // 👇 Getters y Setters para Galería
  get galeriaTitulo(): string {
    return this.nuevaInvitacion.galeria?.titulo || '';
  }

  set galeriaTitulo(value: string) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.titulo = value;
  }

  get galeriaDescripcion(): string {
    return this.nuevaInvitacion.galeria?.descripcion || '';
  }

  set galeriaDescripcion(value: string) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.descripcion = value;
  }

  get galeriaMostrarSeccion(): boolean {
    return this.nuevaInvitacion.galeria?.mostrarSeccion ?? false;
  }

  set galeriaMostrarSeccion(value: boolean) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.mostrarSeccion = value;
  }

  get galeriaVelocidad(): number {
    return this.nuevaInvitacion.galeria?.velocidad || 1000;
  }

  set galeriaVelocidad(value: number) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.velocidad = value;
  }

  get galeriaMostrarControles(): boolean {
    return this.nuevaInvitacion.galeria?.mostrarControles ?? true;
  }

  set galeriaMostrarControles(value: boolean) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.mostrarControles = value;
  }

  get galeriaMostrarCompartir(): boolean {
    return this.nuevaInvitacion.galeria?.mostrarCompartir ?? true;
  }

  set galeriaMostrarCompartir(value: boolean) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.mostrarCompartir = value;
  }

  get galeriaMostrarPaginacion(): boolean {
    return this.nuevaInvitacion.galeria?.mostrarPaginacion ?? true;
  }

  set galeriaMostrarPaginacion(value: boolean) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.mostrarPaginacion = value;
  }

  get galeriaFotos(): any[] {
    return this.nuevaInvitacion.galeria?.fotos || [];
  }

  // 👇 Métodos para fotos
  agregarFotoGaleria() {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.fotos.push({
      url: '',
      titulo: '',
      descripcion: '',
      destacada: false,
    });
  }

  eliminarFotoGaleria(index: number) {
    if (this.nuevaInvitacion.galeria?.fotos) {
      this.nuevaInvitacion.galeria.fotos.splice(index, 1);
    }
  }

  toggleFotoDestacada(index: number) {
    if (this.nuevaInvitacion.galeria?.fotos) {
      const foto = this.nuevaInvitacion.galeria.fotos[index];
      foto.destacada = !foto.destacada;
    }
  }

  seleccionarEstiloGaleria(estilo: string) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.estilo = estilo as any;
  }

  seleccionarEfectoGaleria(efecto: string) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        descripcion: '',
        fotos: [],
        estilo: 'grid',
        efecto: 'slide',
        velocidad: 1000,
        mostrarControles: true,
        mostrarCompartir: true,
        mostrarPaginacion: true,
      };
    }
    this.nuevaInvitacion.galeria.efecto = efecto as any;
  }
}
