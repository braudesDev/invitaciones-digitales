// ================================================================
// FORMULARIO DE INVITACIONES - COMPONENTE PRINCIPAL
// ================================================================
// Este componente maneja la creación y edición de invitaciones
// digitales para eventos (bodas, XV años, cumpleaños).
// ================================================================

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

// === LIBRERÍAS EXTERNAS ===
import Swal from 'sweetalert2'; // Alertas bonitas y personalizables
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore'; // Firebase Firestore
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage'; // Firebase Storage para imágenes
import { ActivatedRoute } from '@angular/router'; // Para obtener parámetros de la URL
import { Auth } from '@angular/fire/auth'; // Autenticación de Firebase
import { HttpClient } from '@angular/common/http'; // Para peticiones HTTP (Cloudinary)
import { ImageUploadComponent } from '../../../components/image-upload/image-upload'; // Componente de subida de imágenes
import {
  PadrinoAsignado,
  ROLES_PADrinos,
  TipoRolPadrino,
  getRolesPorEvento,
} from '../../../models/padrino.model'; // Modelos y utilidades de padrinos
import {
  ESTILOS_DISPONIBLES,
  COLORES_DISPONIBLES,
  DressCode,
  getEstiloNombre,
  getEstiloIcon,
  getEstiloDescripcion,
} from '../../../models/dress-code.model'; // Modelos y utilidades de dress code
import { Contador } from '../../../models/contador.model'; // Modelo y utilidades del contador
import { ESTILOS_CONTADOR } from '../../../models/contador.model';

// ================================================================
// 1. INTERFAZ: Invitación Completa
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
  historia?: {
    // Sección de historia
    mostrarSeccion: boolean;
    estilo: 'timeline' | 'tarjetas' | 'album' | 'minimalista';
    titulo: string;
    descripcion: string;
    momentos: { fecha: string; descripcion: string; imagen?: string }[];
  };
  photos: string[]; // Fotos antiguas (deprecado)
  anfitrionId?: string; // ID del anfitrión (usuario)
  ceremonia: {
    // Detalles de la ceremonia
    lugar: string;
    direccion: string;
    hora: string;
    mapaUrl?: string; // URL de Google Maps
    imagenTemplo?: string; // Imagen del templo/iglesia
  };
  recepcion: {
    // Detalles de la recepción
    lugar: string;
    direccion: string;
    hora: string;
    mapaUrl?: string; // URL de Google Maps
    imagen?: string; // Imagen del lugar
    descripcion?: string; // Descripción adicional
  };
  dressCode: {
    // Código de vestimenta
    estilo: string; // Estilo seleccionado
    colores: string[]; // Colores sugeridos
    coloresReservados: string[]; // Colores que NO deben usar
    titulo: string; // Título personalizado
    descripcion: string;
    sugerencia: string;
    notaAdicional: string;
  };
  padres: {
    // Nombres de padres
    padreNovia: string;
    madreNovia: string;
    padreNovio: string;
    madreNovio: string;
    novio?: string;
    novia?: string;
  };
  padrinos: PadrinoAsignado[]; // Lista de padrinos (nuevo formato)
  regalos: {
    // Mesa de regalos
    texto: string;
    links: { nombre: string; url: string }[];
  };
  confirmacion: {
    // Confirmación de asistencia
    telefono: string;
    whatsapp: string;
    link: string;
  };
  hashtag: string; // Hashtag del evento
  consideraciones: string; // Notas adicionales
  hospedaje?: {
    // Sección de hospedaje (opcional)
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
    // Sección de galería (opcional)
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
  contador?: Contador; //
}

// ================================================================
// 2. INTERFAZ: Paleta de Colores
// ================================================================
// Define la estructura de una paleta de colores premium
// ================================================================
interface Paleta {
  primary: string; // Color principal
  secondary: string; // Color secundario
  accent: string; // Color de acento
  text: string; // Color de texto
}

// ================================================================
// 3. COMPONENTE PRINCIPAL
// ================================================================
@Component({
  selector: 'app-formulario-invitacion', // Selector HTML
  standalone: true, // Componente standalone (no necesita NgModule)
  imports: [FormsModule, ImageUploadComponent], // Módulos importados
  templateUrl: './formulario-invitacion.component.html',
  changeDetection: ChangeDetectionStrategy.Eager, // Estrategia de detección de cambios
  styleUrls: ['./formulario-invitacion.component.css'],
})
export class FormularioInvitacionComponent implements OnInit {
  // ==============================================================
  // 3.1 PALETAS DE COLORES PREMIUM
  // ==============================================================
  // 6 paletas predefinidas con combinaciones de colores profesionales
  // ==============================================================
  paletas: { [key: string]: Paleta } = {
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

  paletaSeleccionada: string = ''; // ID de la paleta actualmente seleccionada

  /**
   * Aplica una paleta de colores a la invitación
   * @param tipo - ID de la paleta (premium, champagne, rosegold, etc.)
   */
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

  // ==============================================================
  // 3.2 PROPIEDADES DEL COMPONENTE
  // ==============================================================
  invitacionId: string | null = null; // ID de la invitación (si estamos editando)
  cargando = false; // Estado de carga
  tabActivo: 'basico' | 'ceremonia' | 'extras' = 'basico'; // Pestaña activa

  // ==============================================================
  // 3.3 ESTILOS PARA HOSPEDAJE
  // ==============================================================
  estilosHospedaje = [
    { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
    { valor: 'timeline', nombre: 'Timeline', icon: '📅' },
    { valor: 'catalogo', nombre: 'Catálogo', icon: '📖' },
    { valor: 'iconos', nombre: 'Íconos', icon: '🎯' },
    { valor: 'mosaico', nombre: 'Mosaico', icon: '🧩' },
  ];

  // ==============================================================
  // 3.4 OBJETO PRINCIPAL: NUEVA INVITACIÓN
  // ==============================================================
  // Contiene todos los datos de la invitación que se está creando/editando
  // ==============================================================
  nuevaInvitacion: InvitacionCompleta = {
    name: '',
    slug: '',
    tipo: 'boda', // Valor por defecto
    nombres: '',
    fecha: new Date().toISOString().substring(0, 16), // Fecha actual en formato ISO
    lugar: '',
    heroImage: '',
    primaryColor: '#7A8B7D', // Color por defecto
    secondaryColor: '#CBB89D',
    accentColor: '#B08A4A',
    textColor: '#3F4A42',
    fontFamily: "'Playfair Display', serif", // Fuente por defecto
    frasePrincipal: '',
    mensajePrincipal: '',
    historia: {
      // Sección de historia por defecto
      mostrarSeccion: true,
      estilo: 'timeline',
      titulo: 'Nuestra Historia',
      descripcion: '',
      momentos: [],
    },
    galeria: {
      // Sección de galería por defecto
      mostrarSeccion: true,
      titulo: 'Nuestros Momentos',
      subtitulo: '',
      descripcion: '',
      fotos: [],
      estilo: 'grid',
      efecto: 'slide',
      velocidad: 1000,
      mostrarControles: true,
      mostrarCompartir: true,
      mostrarPaginacion: true,
    },
    photos: [],
    anfitrionId: '',
    ceremonia: {
      // Datos de ceremonia (vacíos)
      lugar: '',
      direccion: '',
      hora: '',
      mapaUrl: '',
      imagenTemplo: '',
    },
    recepcion: {
      // Datos de recepción (vacíos)
      lugar: '',
      direccion: '',
      hora: '',
      mapaUrl: '',
      imagen: '',
      descripcion: '',
    },
    dressCode: {
      // Código de vestimenta (vacío)
      estilo: '',
      colores: [],
      coloresReservados: [],
      titulo: '',
      descripcion: '',
      sugerencia: '',
      notaAdicional: '',
    },
    padres: {
      // Datos de padres (vacíos)
      padreNovia: '',
      madreNovia: '',
      padreNovio: '',
      madreNovio: '',
      novio: '',
      novia: '',
    },
    padrinos: [], // Lista de padrinos (vacía)
    regalos: { texto: '', links: [] }, // Mesa de regalos (vacía)
    confirmacion: { telefono: '', whatsapp: '', link: '' }, // Confirmación (vacía)
    hashtag: '',
    consideraciones: '',

    contador: {
      mostrarSeccion: true,
      fechaEvento: '',
      estilo: 'clasico',
      titulo: 'Faltan para nuestro gran día',
      mensaje: '¡No podemos esperar para celebrar contigo!',
      colorPrincipal: '#c9a87c',
      colores: {
        dias: '#5c3d2e',
        horas: '#8b6b4a',
        minutos: '#c9a87c',
        segundos: '#e8d5c0',
      },
      etiquetas: {
        dias: 'DÍAS',
        horas: 'HORAS',
        minutos: 'MINUTOS',
        segundos: 'SEGUNDOS',
      },
    },
  };

  // ==============================================================
  // 3.5 ESTADO DE ACORDEONES
  // ==============================================================
  // Controlan la apertura/cierre de cada sección plegable
  // ==============================================================
  acordeonAbierto = false; // Sección de padres
  acordeonPadrinos = false; // Sección de padrinos
  acordeonRegalos = false; // Sección de regalos
  acordeonGaleria = false; // Sección de galería
  acordeonConfirmacion = false; // Sección de confirmación
  acordeonConsideraciones = false; // Sección de consideraciones
  acordeonHashtag = false; // Sección de hashtag
  acordeonDressCode = false; // Sección de dress code
  acordeonHistoria = false; // Sección de historia
  acordeonHospedaje = false; // Sección de hospedaje
  acordeonContador = false; // Seccion del contador
  imagenSubiendo = false; // Estado de subida de imagen

  // ==============================================================
  // 3.6 CONSTRUCTOR
  // ==============================================================
  // Inyecta los servicios necesarios para el funcionamiento del componente
  // ==============================================================
  constructor(
    private firestore: Firestore, // Servicio de Firestore
    private route: ActivatedRoute, // Servicio de rutas (para obtener el ID)
    private auth: Auth, // Servicio de autenticación
    private storage: Storage, // Servicio de Storage
    private http: HttpClient, // Servicio HTTP (para Cloudinary)
  ) {}

  // ==============================================================
  // 3.7 ngOnInit - INICIALIZACIÓN
  // ==============================================================
  // Se ejecuta cuando el componente se inicializa.
  // Verifica si hay un ID en la URL para cargar una invitación existente.
  // ==============================================================
  async ngOnInit() {
    this.invitacionId = this.route.snapshot.paramMap.get('id');
    if (this.invitacionId) {
      this.cargando = true;
      const ref = doc(this.firestore, `invitaciones/${this.invitacionId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Partial<InvitacionCompleta>;

        // --- CONVERSIÓN DE PADRINOS (MIGRACIÓN) ---
        // Si los padrinos están en formato antiguo (string[]), los convierte
        // al nuevo formato (PadrinoAsignado[])
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

        // --- PROCESAR DRESS CODE ---
        // Asegura que todos los campos del dress code estén presentes
        if (data.dressCode) {
          if (!data.dressCode.colores) data.dressCode.colores = [];
          if (!data.dressCode.coloresReservados)
            data.dressCode.coloresReservados = [];
          if (!data.dressCode.titulo) data.dressCode.titulo = '';
          if (!data.dressCode.descripcion) data.dressCode.descripcion = '';
          if (!data.dressCode.sugerencia) data.dressCode.sugerencia = '';
          if (!data.dressCode.notaAdicional) data.dressCode.notaAdicional = '';
        }

        // --- PROCESAR HISTORIA ---
        // Asegura que todos los campos de la historia estén presentes
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

        // --- ASIGNAR DATOS ---
        this.nuevaInvitacion = {
          ...this.nuevaInvitacion,
          ...data,
          photos: data.photos || [],
          padrinos: data.padrinos || [],
        };

        // --- DETECTAR PALETA POR COLORES ---
        // Verifica si los colores actuales coinciden con alguna paleta
        this.detectarPaletaPorColores();
      }
      this.cargando = false;
    }
  }

  // ==============================================================
  // 3.8 SUBIR IMAGEN A CLOUDINARY
  // ==============================================================
  // Sube una imagen a Cloudinary y obtiene la URL segura
  // ==============================================================
  async subirImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // --- VALIDACIONES ---
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Solo se permiten imágenes', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // Máximo 5MB
      Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
      return;
    }

    this.imagenSubiendo = true;

    try {
      // --- SUBIR A CLOUDINARY ---
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'invitaciones-app');

      const cloudName = 'drsyb53ae'; // Nombre del cloud de Cloudinary

      const response = await this.http
        .post<{
          secure_url: string;
        }>(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
        )
        .toPromise();

      // --- ASIGNAR URL ---
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

  // ==============================================================
  // 3.9 MÉTODOS PARA PADRINOS
  // ==============================================================
  // Funciones para gestionar la lista de padrinos
  // ==============================================================

  /**
   * Obtiene los roles disponibles según el tipo de evento
   * @returns Array de IDs de roles
   */
  getRolesDisponibles(): string[] {
    return getRolesPorEvento(this.nuevaInvitacion.tipo);
  }

  /**
   * Obtiene el nombre legible de un rol
   * @param rolId - ID del rol
   * @returns Nombre del rol
   */
  getRolLabel(rolId: string): string {
    return ROLES_PADrinos[rolId as TipoRolPadrino]?.nombre || rolId;
  }

  /**
   * Obtiene el icono de un rol
   * @param rolId - ID del rol
   * @returns Icono (emoji o URL)
   */
  getRolIcon(rolId: string): string {
    return ROLES_PADrinos[rolId as TipoRolPadrino]?.icon || '⭐';
  }

  /**
   * Obtiene la descripción de un rol
   * @param rolId - ID del rol
   * @returns Descripción del rol
   */
  getRolDescripcion(rolId: string): string {
    return ROLES_PADrinos[rolId as TipoRolPadrino]?.descripcion || '';
  }

  /**
   * Agrupa los padrinos por rol para mostrar una vista previa
   * @returns Array de grupos { rolId, rol, nombres[] }
   */
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

  /**
   * Agrega un nuevo padrino vacío a la lista
   */
  agregarPadrino() {
    const rolesDisponibles = this.getRolesDisponibles();
    this.nuevaInvitacion.padrinos.push({
      nombre: '',
      rol: rolesDisponibles.length > 0 ? rolesDisponibles[0] : 'personalizado',
    });
  }

  /**
   * Elimina un padrino de la lista
   * @param index - Índice del padrino a eliminar
   */
  eliminarPadrino(index: number) {
    this.nuevaInvitacion.padrinos.splice(index, 1);
  }

  /**
   * Callback cuando cambia el rol de un padrino
   * @param index - Índice del padrino
   */
  onRolChange(index: number) {
    console.log('Rol cambiado para padrino', index);
  }

  // ==============================================================
  // 3.10 MÉTODOS PARA REGALOS
  // ==============================================================
  // Funciones para gestionar la mesa de regalos
  // ==============================================================

  /**
   * Agrega un nuevo link de tienda a la mesa de regalos
   */
  agregarRegaloLink() {
    this.nuevaInvitacion.regalos.links.push({ nombre: '', url: '' });
  }

  /**
   * Elimina un link de la mesa de regalos
   * @param index - Índice del link a eliminar
   */
  eliminarRegaloLink(index: number) {
    this.nuevaInvitacion.regalos.links.splice(index, 1);
  }

  // ==============================================================
  // 3.11 MÉTODOS PARA FOTOS (DEPRECADO)
  // ==============================================================
  // Funciones para gestionar fotos (formato antiguo)
  // ==============================================================

  /**
   * Agrega una foto vacía a la lista de fotos
   */
  agregarFoto() {
    if (!this.nuevaInvitacion.photos) {
      this.nuevaInvitacion.photos = [];
    }
    this.nuevaInvitacion.photos.push('');
  }

  /**
   * Elimina una foto de la lista
   * @param index - Índice de la foto a eliminar
   */
  eliminarFoto(index: number) {
    this.nuevaInvitacion.photos?.splice(index, 1);
  }

  // ==============================================================
  // 3.12 GUARDAR INVITACIÓN
  // ==============================================================
  // Guarda la invitación en Firestore
  // ==============================================================
  async guardarInvitacion() {
    // --- VALIDACIONES ---
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

    // --- LIMPIAR PADRINOS VACÍOS ---
    const padrinosFiltrados = this.nuevaInvitacion.padrinos.filter(
      (p) => p.nombre && p.nombre.trim() !== '',
    );

    // --- GENERAR SLUG ---
    this.nuevaInvitacion.slug = this.nuevaInvitacion.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    // --- PREPARAR OBJETO PARA GUARDAR ---
    const invitacionParaGuardar = {
      ...this.nuevaInvitacion,
      padrinos: padrinosFiltrados,
      anfitrionId: user.uid,
    };

    // --- GUARDAR EN FIRESTORE ---
    const ref = doc(
      this.firestore,
      `invitaciones/${this.nuevaInvitacion.slug}`,
    );

    try {
      await setDoc(ref, invitacionParaGuardar);
      Swal.fire('Éxito', 'Invitación guardada correctamente', 'success');

      // --- RESETEAR FORMULARIO ---
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
        contador: {
          mostrarSeccion: true,
          fechaEvento: '',
          estilo: 'clasico',
          titulo: 'Faltan para nuestro gran día',
          mensaje: '¡No podemos esperar para celebrar contigo!',
          colorPrincipal: '#c9a87c',
          colores: {
            dias: '#5c3d2e',
            horas: '#8b6b4a',
            minutos: '#c9a87c',
            segundos: '#e8d5c0',
          },
          etiquetas: {
            dias: 'DÍAS',
            horas: 'HORAS',
            minutos: 'MINUTOS',
            segundos: 'SEGUNDOS',
          },
        },
      };
      this.tabActivo = 'basico'; // Vuelve a la pestaña básica
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  }

  // ==============================================================
  // 3.13 DETECTAR PALETA POR COLORES
  // ==============================================================
  // Verifica si los colores actuales coinciden con alguna paleta
  // ==============================================================
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

  // ==============================================================
  // 3.14 TRACK BY PARA NG-FOR
  // ==============================================================
  // Optimiza el rendimiento de las listas (evita re-renders innecesarios)
  // ==============================================================
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // ==============================================================
  // 3.15 DRESS CODE - ESTILOS Y COLORES
  // ==============================================================
  // Utilidades para el código de vestimenta
  // ==============================================================

  // Estilos disponibles (importados del modelo)
  estilosDisponibles = ESTILOS_DISPONIBLES;
  coloresDisponibles = COLORES_DISPONIBLES;

  // Métodos helper para el Dress Code (importados del modelo)
  getEstiloNombre = getEstiloNombre;
  getEstiloIcon = getEstiloIcon;
  getEstiloDescripcion = getEstiloDescripcion;

  /**
   * Verifica si un color está seleccionado en colores sugeridos
   * @param color - Código hexadecimal del color
   * @returns true si está seleccionado
   */
  isColorSelected(color: string): boolean {
    return this.nuevaInvitacion.dressCode.colores?.includes(color) || false;
  }

  /**
   * Alterna la selección de un color en colores sugeridos
   * @param color - Código hexadecimal del color
   */
  toggleColor(color: string): void {
    if (!this.nuevaInvitacion.dressCode.colores) {
      this.nuevaInvitacion.dressCode.colores = [];
    }

    const index = this.nuevaInvitacion.dressCode.colores.indexOf(color);
    if (index > -1) {
      // Quitar color
      this.nuevaInvitacion.dressCode.colores.splice(index, 1);
    } else {
      // Agregar color (máximo 4)
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

  /**
   * Elimina un color de la lista de colores sugeridos
   * @param color - Código hexadecimal del color
   */
  removeColor(color: string): void {
    const index = this.nuevaInvitacion.dressCode.colores.indexOf(color);
    if (index > -1) {
      this.nuevaInvitacion.dressCode.colores.splice(index, 1);
    }
  }

  /**
   * Verifica si un color está seleccionado como reservado
   * @param color - Código hexadecimal del color
   * @returns true si está reservado
   */
  isColorReservado(color: string): boolean {
    return (
      this.nuevaInvitacion.dressCode.coloresReservados?.includes(color) || false
    );
  }

  /**
   * Alterna la selección de un color como reservado
   * @param color - Código hexadecimal del color
   */
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

  /**
   * Elimina un color de la lista de colores reservados
   * @param color - Código hexadecimal del color
   */
  removeColorReservado(color: string): void {
    const index =
      this.nuevaInvitacion.dressCode.coloresReservados.indexOf(color);
    if (index > -1) {
      this.nuevaInvitacion.dressCode.coloresReservados.splice(index, 1);
    }
  }

  // ==============================================================
  // 3.16 HISTORIA - ESTILOS Y MOMENTOS
  // ==============================================================
  // Utilidades para la sección de historia
  // ==============================================================

  /**
   * Lista de estilos disponibles para la historia
   */
  estilosHistoria = [
    { valor: 'timeline', nombre: 'Línea de tiempo', icon: '📅' },
    { valor: 'tarjetas', nombre: 'Tarjetas', icon: '🃏' },
    { valor: 'album', nombre: 'Álbum', icon: '📸' },
    { valor: 'minimalista', nombre: 'Minimalista', icon: '✨' },
  ];

  /**
   * Agrega un nuevo momento a la historia
   */
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

  /**
   * Elimina un momento de la historia
   * @param index - Índice del momento a eliminar
   */
  eliminarMomento(index: number) {
    if (this.nuevaInvitacion.historia?.momentos) {
      this.nuevaInvitacion.historia.momentos.splice(index, 1);
    }
  }

  /**
   * Selecciona un estilo para la historia
   * @param estilo - ID del estilo
   */
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
    this.nuevaInvitacion.historia.estilo = estilo as
      | 'timeline'
      | 'tarjetas'
      | 'album'
      | 'minimalista';
  }

  // ==============================================================
  // 3.17 GETTERS/SETTERS PARA HISTORIA
  // ==============================================================
  // Getters y setters para acceder a propiedades de la historia
  // desde el template
  // ==============================================================

  get historiaMomentos(): any[] {
    return this.nuevaInvitacion.historia?.momentos || [];
  }

  get historiaTitulo(): string {
    return this.nuevaInvitacion.historia?.titulo || '';
  }

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

  get historiaDescripcion(): string {
    return this.nuevaInvitacion.historia?.descripcion || '';
  }

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

  // ==============================================================
  // 3.18 GETTERS/SETTERS PARA HOSPEDAJE
  // ==============================================================
  // Getters y setters para acceder a propiedades del hospedaje
  // desde el template
  // ==============================================================

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

  /**
   * Agrega un nuevo alojamiento a la lista
   */
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

  /**
   * Elimina un alojamiento de la lista
   * @param index - Índice del alojamiento a eliminar
   */
  eliminarAlojamiento(index: number) {
    if (this.nuevaInvitacion.hospedaje?.alojamientos) {
      this.nuevaInvitacion.hospedaje.alojamientos.splice(index, 1);
    }
  }

  /**
   * Selecciona un estilo para el hospedaje
   * @param estilo - ID del estilo
   */
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

  // ==============================================================
  // 3.19 GALERÍA - ESTILOS Y EFECTOS
  // ==============================================================
  // Utilidades para la sección de galería
  // ==============================================================

  /**
   * Lista de estilos disponibles para la galería
   */
  estilosGaleria = [
    { valor: 'grid', nombre: 'Grid', icon: '📐' },
    { valor: 'masonry', nombre: 'Masonry', icon: '🧱' },
    { valor: 'carousel', nombre: 'Carrusel', icon: '🎠' },
    { valor: 'slideshow', nombre: 'Presentación', icon: '🎬' },
  ];

  /**
   * Lista de efectos disponibles para la galería
   */
  efectosGaleria = [
    { valor: 'slide', nombre: 'Deslizar', icon: '➡️' },
    { valor: 'fade', nombre: 'Desvanecer', icon: '🌫️' },
    { valor: 'zoom', nombre: 'Zoom', icon: '🔍' },
  ];

  // ==============================================================
  // 3.20 GETTERS/SETTERS PARA GALERÍA
  // ==============================================================
  // Getters y setters para acceder a propiedades de la galería
  // desde el template
  // ==============================================================

  get galeriaTitulo(): string {
    return this.nuevaInvitacion.galeria?.titulo || '';
  }

  set galeriaTitulo(value: string) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        subtitulo: '',
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

  get galeriaSubtitulo(): string {
    return this.nuevaInvitacion.galeria?.subtitulo || '';
  }

  set galeriaSubtitulo(value: string) {
    if (!this.nuevaInvitacion.galeria) {
      this.nuevaInvitacion.galeria = {
        mostrarSeccion: true,
        titulo: 'Nuestros Momentos',
        subtitulo: '',
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
    this.nuevaInvitacion.galeria.subtitulo = value;
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

  get estilosContador() {
    return ESTILOS_CONTADOR;
  }

  get contadorData(): Contador {
    if (!this.nuevaInvitacion.contador) {
      // Si no existe, crear uno por defecto
      this.nuevaInvitacion.contador = {
        mostrarSeccion: true,
        fechaEvento: '',
        estilo: 'clasico',
        titulo: 'Faltan para nuestro gran día',
        mensaje: '¡No podemos esperar para celebrar contigo!',
        colorPrincipal: '#c9a87c',
        colores: {
          dias: '#5c3d2e',
          horas: '#8b6b4a',
          minutos: '#c9a87c',
          segundos: '#e8d5c0',
        },
        etiquetas: {
          dias: 'DÍAS',
          horas: 'HORAS',
          minutos: 'MINUTOS',
          segundos: 'SEGUNDOS',
        },
      };
    }
    return this.nuevaInvitacion.contador;
  }

  seleccionarEstiloContador(estilo: string) {
    // Validar que el estilo sea uno de los permitidos
    const estilosPermitidos = ['clasico', 'minimalista', 'floral', 'romantico'];
    if (estilosPermitidos.includes(estilo)) {
      this.contadorData.estilo = estilo as
        | 'clasico'
        | 'minimalista'
        | 'floral'
        | 'romantico';
    }
  }

  /**
   * Agrega una nueva foto a la galería
   */
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

  /**
   * Elimina una foto de la galería
   * @param index - Índice de la foto a eliminar
   */
  eliminarFotoGaleria(index: number) {
    if (this.nuevaInvitacion.galeria?.fotos) {
      this.nuevaInvitacion.galeria.fotos.splice(index, 1);
    }
  }

  /**
   * Alterna el estado "destacada" de una foto
   * @param index - Índice de la foto
   */
  toggleFotoDestacada(index: number) {
    if (this.nuevaInvitacion.galeria?.fotos) {
      const foto = this.nuevaInvitacion.galeria.fotos[index];
      foto.destacada = !foto.destacada;
    }
  }

  /**
   * Selecciona un estilo para la galería
   * @param estilo - ID del estilo
   */
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

  /**
   * Selecciona un efecto para la galería
   * @param efecto - ID del efecto
   */
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
