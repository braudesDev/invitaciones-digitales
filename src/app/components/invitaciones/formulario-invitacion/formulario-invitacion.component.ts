// src/app/components/invitaciones/formulario-invitacion/formulario-invitacion.component.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// === LIBRERÍAS EXTERNAS ===
import Swal from 'sweetalert2';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

// === COMPONENTES ===
import { ImageUploadComponent } from '../../../components/image-upload/image-upload';
import { RegalosSectionComponent } from '../invitacion-generica/sections/regalos-section/regalos-section.component';

// === MODELOS ===
import { InvitacionCompleta } from '../../../models/invitacion.model';
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
import { Contador, ESTILOS_CONTADOR } from '../../../models/contador.model';
import { Regalos, ESTILOS_REGALOS } from '../../../models/regalos.model';
import {
  Consideraciones,
  ESTILOS_CONSIDERACIONES,
} from '../../../models/consideraciones.model';
import {
  Confirmacion,
  ESTILOS_CONFIRMACION,
} from '../../../models/confirmacion.model';
import { Paleta, PALETAS_PREMIUM } from '../../../models/paleta.model';
import {
  FUENTES_DISPONIBLES,
  Fuente,
  getNombreFuente,
} from '../../../models/fuentes.model';
import {
  AnimacionHero,
  ANIMACIONES_HERO,
} from '../../../models/animaciones.model';
// formulario-invitacion.component.ts
import { NgIcon } from '@ng-icons/core'; // 👈 AGREGAR

// ================================================================
// 3. COMPONENTE PRINCIPAL
// ================================================================
@Component({
  selector: 'app-formulario-invitacion', // Selector HTML
  standalone: true, // Componente standalone (no necesita NgModule)
  imports: [FormsModule, ImageUploadComponent, NgIcon], // Módulos importados
  templateUrl: './formulario-invitacion.component.html',
  changeDetection: ChangeDetectionStrategy.Eager, // Estrategia de detección de cambios
  styleUrls: ['./formulario-invitacion.component.css'],
})
export class FormularioInvitacionComponent implements OnInit {
  // ==============================================================
  // 3.1 PALETAS DE COLORES PREMIUM (importadas del modelo)
  // ==============================================================
  paletas = PALETAS_PREMIUM; // Paletas de colores premium
  fuentes = FUENTES_DISPONIBLES;
  animacionesHero = ANIMACIONES_HERO;
  animacionSeleccionada: string = ''; // ID de la animación actualmente seleccionada

  paletaSeleccionada: string = ''; // ID de la paleta actualmente seleccionada

  modo: 'edicion' | 'vista' = 'edicion';
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

  obtenerNombrePaleta(key: string): string {
    const nombres: { [key: string]: string } = {
      steel: 'Azul Acero',
      rose: 'Rosa Terracota',
      olive: 'Oliva Natural',
      acuarela: 'Acuarela',
      indigo: 'Índigo Moderno',
      lino: 'Lino Elegante',
      carbon: 'Carbón',
      champan: 'Champán',
      plata: 'Plata',
      morado: 'Morado Pop',
      menta: 'Menta',
      jungla: 'Jungla',
      bodaReal: 'Boda Real',
      bodaCampestre: 'Boda Campestre',
      xvPrincesa: 'XV Princesa',
      bodaPlaya: 'Boda Playa',
      xvElegante: 'XV Elegante',
      bodaRustica: 'Boda Rústica',
      xvGlamour: 'XV Glamour',
      bodaBoho: 'Boda Boho',
    };
    return nombres[key] || key;
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
    { valor: 'tarjetas', nombre: 'Tarjetas', icon: 'heroSquares2x2' },
    { valor: 'timeline', nombre: 'Timeline', icon: 'heroClock' },
    { valor: 'catalogo', nombre: 'Catálogo', icon: 'heroBookOpen' },
    { valor: 'iconos', nombre: 'Íconos', icon: 'heroTag' },
    { valor: 'mosaico', nombre: 'Mosaico', icon: 'heroSquaresPlus' },
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
    confirmacion: { telefono: '', whatsapp: '', link: '' }, // Confirmación (vacía)
    confirmacionData: {
      mostrarSeccion: true,
      estilo: 'tarjetas',
      titulo: 'Confirma tu asistencia',
      descripcion:
        'Nos encantaría compartir este momento contigo. Por favor confirma tu asistencia.',
      mostrarConfirmar: true,
      mostrarRechazar: true,
      mostrarCalendario: true,
    },
    hashtag: {
      titulo: 'HASHTAG',
      subtitulo: 'Comparte tus momentos',
      hashtag: '#MarianaYAlejandro',
      mensaje: '¡Únete a la celebración!',
      icono: 'fas fa-hashtag',
      mostrarIcono: true,
      resaltarHashtag: true,
      mostrarCaracteristicas: true,
    },
    consideracionesData: {
      mostrarSeccion: true,
      estilo: 'iconos',
      titulo: 'Consideraciones',
      subtitulo: 'Para que todo salga perfecto',
      mensajeIntro:
        'Gracias por ser parte de este momento tan especial. Te compartimos algunas recomendaciones importantes.',
      colorIconos: '#c9a87c',
      items: [],
    },
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
    regalos: {
      mostrarSeccion: true,
      estilo: 'tarjetas',
      titulo: 'Mesa de Regalos',
      descripcion:
        'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
      opciones: [],
      textoBoton: 'Ver mesa de regalos',
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
  acordeonCeremonia = false; // Sección de ceremonia
  acordeonRecepcion = false; // Sección de recepción
  acordeonFrases = false; // Sección de frases
  acordeonHeroImage = false; // Sección de imagen principal
  acordeonEvento = false; // Sección de eventos
  acordeonColores = false; // Sección de colores
  acordeonFuente = false; // Sección de fuentes
  filtroFuente = ''; // Filtro de búsqueda de fuentes
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
        if (data.historia) {
          if (typeof data.historia === 'string') {
            data.historia = {
              mostrarSeccion: true,
              estilo: 'timeline',
              titulo: 'Nuestra Historia',
              descripcion: data.historia || '',
              momentos: [],
            };
          } else {
            if (!data.historia.momentos) data.historia.momentos = [];
            if (!data.historia.titulo)
              data.historia.titulo = 'Nuestra Historia';
            if (!data.historia.estilo) data.historia.estilo = 'timeline';
            if (data.historia.mostrarSeccion === undefined)
              data.historia.mostrarSeccion = true;
            if (!data.historia.descripcion) data.historia.descripcion = '';
          }
        }

        // 👇 AGREGAR MIGRACIÓN DE REGALOS AQUÍ
        // --- MIGRAR REGALOS DEL FORMATO ANTIGUO ---
        if (data.regalos && !('opciones' in data.regalos)) {
          const antiguo = data.regalos as any;
          const opciones =
            antiguo.links?.map((link: any) => ({
              nombre: link.nombre || '',
              subtitulo: '',
              icono: '🎁',
              url: link.url || '',
            })) || [];

          data.regalos = {
            mostrarSeccion: true,
            estilo: 'tarjetas',
            titulo: 'Mesa de Regalos',
            descripcion:
              antiguo.texto ||
              'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
            opciones: opciones,
            textoBoton: 'Ver mesa de regalos',
          };
        }

        // ================================================================
        // # NORMALIZAR HASHTAG (AGREGAR ESTO)
        // ================================================================
        if (data.hashtag) {
          // Si es string, convertirlo a objeto
          if (typeof data.hashtag === 'string') {
            data.hashtag = {
              titulo: 'HASHTAG',
              subtitulo: 'Comparte tus momentos',
              hashtag: data.hashtag || '#MiEvento',
              mensaje: '¡Únete a la celebración!',
              icono: 'fas fa-hashtag',
              mostrarIcono: true,
              resaltarHashtag: true,
              mostrarCaracteristicas: true,
            };
          } else {
            // Si ya es objeto, asegurar que tenga todas las propiedades
            data.hashtag = {
              titulo: data.hashtag.titulo || 'HASHTAG',
              subtitulo: data.hashtag.subtitulo || 'Comparte tus momentos',
              hashtag: data.hashtag.hashtag || '#MiEvento',
              mensaje: data.hashtag.mensaje || '¡Únete a la celebración!',
              icono: data.hashtag.icono || 'fas fa-hashtag',
              mostrarIcono:
                data.hashtag.mostrarIcono !== undefined
                  ? data.hashtag.mostrarIcono
                  : true,
              resaltarHashtag:
                data.hashtag.resaltarHashtag !== undefined
                  ? data.hashtag.resaltarHashtag
                  : true,
              mostrarCaracteristicas:
                data.hashtag.mostrarCaracteristicas !== undefined
                  ? data.hashtag.mostrarCaracteristicas
                  : true,
            };
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
  // 3.10 MÉTODOS PARA REGALOS (NUEVO FORMATO)
  // ==============================================================
  // Funciones para gestionar la mesa de regalos usando el nuevo modelo
  // ==============================================================

  /**
   * Getter que asegura que regalos tenga el formato correcto
   * Migra automáticamente desde el formato antiguo si es necesario
   */
  get regalosData(): Regalos {
    // Si no existe o es el formato antiguo, crear uno nuevo
    if (
      !this.nuevaInvitacion.regalos ||
      !('opciones' in this.nuevaInvitacion.regalos)
    ) {
      // Si es el formato antiguo (texto + links), migrar datos
      const antiguo = this.nuevaInvitacion.regalos as any;
      const opciones =
        antiguo?.links?.map((link: any) => ({
          nombre: link.nombre || '',
          subtitulo: '',
          icono: '🎁',
          url: link.url || '',
        })) || [];

      this.nuevaInvitacion.regalos = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Mesa de Regalos',
        descripcion:
          antiguo?.texto ||
          'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
        opciones: opciones,
        textoBoton: 'Ver mesa de regalos',
      };
    }
    return this.nuevaInvitacion.regalos as Regalos;
  }

  /**
   * Maneja los cambios emitidos por el componente regalos-section
   * @param regalos - Objeto Regalos actualizado
   */
  onRegalosChange(regalos: Regalos) {
    this.nuevaInvitacion.regalos = regalos;
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

    console.log(
      '📤 Datos a guardar - consideracionesData:',
      this.nuevaInvitacion.consideracionesData,
    );

    // --- PREPARAR OBJETO PARA GUARDAR ---
    const invitacionParaGuardar = {
      ...this.nuevaInvitacion,
      padrinos: padrinosFiltrados,
      anfitrionId: user.uid,
    };

    console.log('📤 Objeto completo a guardar:', invitacionParaGuardar);

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
        heroImageMovil: '', // 👈 AGREGAR
        heroImageEscritorio: '', // 👈 AGREGAR
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
        regalos: {
          mostrarSeccion: true,
          estilo: 'tarjetas',
          titulo: 'Mesa de Regalos',
          descripcion:
            'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, encontrarás nuestras opciones aquí.',
          opciones: [],
          textoBoton: 'Ver mesa de regalos',
        },
        confirmacion: { telefono: '', whatsapp: '', link: '' },
        confirmacionData: {
          mostrarSeccion: true,
          estilo: 'tarjetas',
          titulo: 'Confirma tu asistencia',
          descripcion:
            'Nos encantaría compartir este momento contigo. Por favor confirma tu asistencia.',
          mostrarConfirmar: true,
          mostrarRechazar: true,
          mostrarCalendario: true,
        },
        hashtag: {
          titulo: 'HASHTAG',
          subtitulo: 'Comparte tus momentos',
          hashtag: '#MarianaYAlejandro',
          mensaje: '¡Únete a la celebración!',
          icono: 'fas fa-hashtag',
          mostrarIcono: true,
          resaltarHashtag: true,
          mostrarCaracteristicas: true,
        },
        consideracionesData: {
          mostrarSeccion: true,
          estilo: 'iconos',
          titulo: 'Consideraciones',
          subtitulo: 'Para que todo salga perfecto',
          mensajeIntro:
            'Gracias por ser parte de este momento tan especial. Te compartimos algunas recomendaciones importantes.',
          colorIconos: '#c9a87c',
          items: [],
        },
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
    { valor: 'timeline', nombre: 'Línea de tiempo', icon: 'heroClock' },
    { valor: 'tarjetas', nombre: 'Tarjetas', icon: 'heroSquares2x2' },
    { valor: 'album', nombre: 'Álbum', icon: 'heroPhoto' },
    { valor: 'minimalista', nombre: 'Minimalista', icon: 'heroSparkles' },
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
  // Propiedad para estilos de regalos
  get estilosRegalos() {
    return ESTILOS_REGALOS;
  }

  agregarOpcionRegalo() {
    if (!this.nuevaInvitacion.regalos.opciones) {
      this.nuevaInvitacion.regalos.opciones = [];
    }
    this.nuevaInvitacion.regalos.opciones.push({
      nombre: '',
      subtitulo: '',
      icono: '🎁',
      url: '',
    });
  }

  seleccionarEstiloRegalos(estilo: string) {
    const estilosPermitidos = [
      'tarjetas',
      'timeline',
      'catalogo',
      'iconos',
      'mosaico',
    ];
    if (estilosPermitidos.includes(estilo)) {
      this.nuevaInvitacion.regalos.estilo = estilo as
        | 'tarjetas'
        | 'timeline'
        | 'catalogo'
        | 'iconos'
        | 'mosaico';
    }
  }

  // formulario-invitacion.component.ts

  // ==============================================================
  // 3.4 ICONOS PARA REGALOS
  // ==============================================================
  iconosRegalos = [
    // 📦 Regalos físicos
    { valor: 'heroBuildingOffice', label: 'Tienda departamental' },
    { valor: 'heroCube', label: 'Amazon / Online' },
    { valor: 'heroGift', label: 'Regalo físico' },
    { valor: 'lucideShoppingBag', label: 'Lista de deseos' },

    // 💰 Regalos en efectivo
    { valor: 'heroBanknotes', label: 'Efectivo / Sobres' },
    { valor: 'lucideBanknoteArrowUp', label: 'Transferencia' },

    // 🎁 Otros
    { valor: 'heroHeart', label: 'Donación' },
    { valor: 'heroStar', label: 'Experiencia' },
  ];

  getIconosPorTipoEvento(tipo: string) {
    if (tipo === 'boda') {
      return [
        { valor: 'heroBanknotes', label: 'Lluvia de sobres' },
        { valor: 'heroBuildingOffice', label: 'Liverpool / Sears' },
        { valor: 'heroCube', label: 'Amazon' },
        { valor: 'heroGift', label: 'Regalo físico' },
        { valor: 'lucideBanknoteArrowUp', label: 'Transferencia' },
        { valor: 'heroHeart', label: 'Luna de miel' },
        { valor: 'heroStar', label: 'Experiencia (viaje, cena)' },
        { valor: 'lucideShoppingBag', label: 'Lista de deseos' },
      ];
    } else if (tipo === 'xv') {
      return [
        { valor: 'heroBanknotes', label: 'Efectivo' },
        { valor: 'heroBuildingOffice', label: 'Liverpool / Sears' },
        { valor: 'heroCube', label: 'Amazon' },
        { valor: 'heroGift', label: 'Regalo físico' },
        { valor: 'lucideBanknoteArrowUp', label: 'Transferencia' },
        { valor: 'heroHeart', label: 'Donación' },
        { valor: 'heroStar', label: 'Experiencia (viaje, cena)' },
        { valor: 'lucideShoppingBag', label: 'Lista de deseos' },
      ];
    }
    return this.iconosRegalos;
  }

  eliminarOpcionRegalo(index: number) {
    if (this.nuevaInvitacion.regalos.opciones) {
      this.nuevaInvitacion.regalos.opciones.splice(index, 1);
    }
  }
  // Getter para estilos
  get estilosConsideraciones() {
    return ESTILOS_CONSIDERACIONES;
  }

  // Getter para consideracionesData
  get consideracionesData(): Consideraciones {
    if (!this.nuevaInvitacion.consideracionesData) {
      this.nuevaInvitacion.consideracionesData = {
        mostrarSeccion: true,
        estilo: 'iconos',
        titulo: 'Consideraciones',
        subtitulo: 'Para que todo salga perfecto',
        mensajeIntro:
          'Gracias por ser parte de este momento tan especial. Te compartimos algunas recomendaciones importantes.',
        colorIconos: '#c9a87c',
        items: [],
      };
    }
    return this.nuevaInvitacion.consideracionesData;
  }

  // Método para seleccionar estilo
  seleccionarEstiloConsideraciones(estilo: string) {
    const estilosPermitidos = [
      'iconos',
      'tarjetas',
      'minimalista',
      'clasico',
      'elegante',
    ];
    if (estilosPermitidos.includes(estilo)) {
      this.consideracionesData.estilo = estilo as
        | 'iconos'
        | 'tarjetas'
        | 'minimalista'
        | 'clasico'
        | 'elegante';
    }
  }

  // Método para agregar item
  agregarItemConsideracion() {
    if (!this.consideracionesData.items) {
      this.consideracionesData.items = [];
    }
    this.consideracionesData.items.push({
      titulo: '',
      descripcion: '',
      icono: '📌',
    });
  }

  // Método para eliminar item
  eliminarItemConsideracion(index: number) {
    if (this.consideracionesData.items) {
      this.consideracionesData.items.splice(index, 1);
    }
  }
  // Getter para estilos
  get estilosConfirmacion() {
    return ESTILOS_CONFIRMACION;
  }

  // Getter para confirmacionData
  get confirmacionData(): Confirmacion {
    if (!this.nuevaInvitacion.confirmacionData) {
      this.nuevaInvitacion.confirmacionData = {
        mostrarSeccion: true,
        estilo: 'tarjetas',
        titulo: 'Confirma tu asistencia',
        descripcion:
          'Nos encantaría compartir este momento contigo. Por favor confirma tu asistencia.',
        mostrarConfirmar: true,
        mostrarRechazar: true,
        mostrarCalendario: true,
      };
    }
    return this.nuevaInvitacion.confirmacionData;
  }

  // Método para seleccionar estilo
  seleccionarEstiloConfirmacion(estilo: string) {
    const estilosPermitidos = [
      'tarjetas',
      'minimalista',
      'lista',
      'elegante',
      'moderno',
    ];
    if (estilosPermitidos.includes(estilo)) {
      this.confirmacionData.estilo = estilo as any;
    }
  }
  /**
   * Selecciona una fuente desde la vista grid
   */

  /**
   * Detecta cambio en el select
   */
  get fuentesFiltradas(): Fuente[] {
    if (this.filtroFuente === 'todos') {
      return this.fuentes;
    }
    return this.fuentes.filter((f) => f.tipo === this.filtroFuente);
  }

  /**
   * Selecciona una fuente desde el grid
   */
  seleccionarFuente(fuente: Fuente) {
    this.nuevaInvitacion.fontFamily = fuente.valor;

    // Forzar actualización de la vista previa
    this.nuevaInvitacion = { ...this.nuevaInvitacion };
  }

  // formulario-invitacion.component.ts

  /**
   * Cambia el filtro de fuentes sin disparar guardado
   */
  setFiltro(tipo: string) {
    this.filtroFuente = tipo;
  }

  /**
   * Obtiene el nombre de la fuente actual
   */
  get nombreFuenteActual(): string {
    const fuente = this.fuentes.find(
      (f) => f.valor === this.nuevaInvitacion.fontFamily,
    );
    return fuente?.nombre || 'Playfair Display';
  }

  /**
   * Selecciona una animación para el Hero
   */
  // Propiedades
  orientacionImagen: string = 'auto'; // 'horizontal' | 'vertical' | 'auto'
  esImagenVertical: boolean = false;

  // Método para seleccionar orientación
  seleccionarOrientacion(tipo: string) {
    this.orientacionImagen = tipo;

    // Guardar la orientación en la invitación
    this.nuevaInvitacion.orientacionImagen = tipo;

    console.log('📐 Orientación seleccionada:', tipo);
  }

  // Detectar orientación automática
  detectarOrientacionImagen(url: string) {
    if (!url || this.orientacionImagen !== 'auto') return;

    const img = new Image();
    img.onload = () => {
      this.esImagenVertical = img.height > img.width;
      console.log(
        '📐 Orientación detectada:',
        this.esImagenVertical ? 'Vertical' : 'Horizontal',
      );
    };
    img.src = url;
  }

  // En el evento de cambio de imagen
  onImageChange(url: string) {
    this.nuevaInvitacion.heroImage = url;
    if (this.orientacionImagen === 'auto') {
      this.detectarOrientacionImagen(url);
    }
  }

  /**
   * Selecciona una animación para el Hero
   * @param animacion - Objeto de la animación seleccionada
   */
  seleccionarAnimacionHero(animacion: AnimacionHero) {
    this.nuevaInvitacion.animacionHero = animacion.valor;
  }

  // ✅ ICONOS DISPONIBLES PARA CONSIDERACIONES (en el formulario)
  iconosConsideraciones = [
    { valor: 'heroClock', label: 'Tiempo' },
    { valor: 'lucideCar', label: 'Transporte' },
    { valor: 'hugeSuit02', label: 'Vestimenta' },
    { valor: 'lucideCheckCheck', label: 'Confirmar' },
    { valor: 'lucideClipboard', label: 'Asistencia' },
    { valor: 'lucideBaby', label: 'Niños' },
    { valor: 'lucideEye', label: 'Supervisión' },
    { valor: 'lucideSmartphone', label: 'Celulares' },
    { valor: 'lucideParkingCircle', label: 'Estacionamiento' },
    { valor: 'lucideSparkles', label: 'Disfruta' },
    { valor: 'hugeStar', label: 'Especial' },
    { valor: 'heroHeart', label: 'Amor' },
    { valor: 'heroGift', label: 'Regalo' },
    { valor: 'heroMapPin', label: 'Ubicación' },
    { valor: 'hugePhoneOff01', label: 'Apagar Telefono' },
    { valor: 'lucideMail', label: 'Correo' },
    { valor: 'heroCamera', label: 'Fotografía' },
  ];
}
