import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

// 👇 IMPORTAR EL MODELO DE PADRINOS
import {
  PadrinoAsignado,
  ROLES_PADrinos,
  TipoRolPadrino,
  getRolesPorEvento,
} from '../../../models/padrino.model';

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
  historia?: string;
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
  dressCode: { descripcion: string; sugerencia: string };
  padres: {
    padreNovia: string;
    madreNovia: string;
    padreNovio: string;
    madreNovio: string;
    novio?: string;
    novia?: string;
    fotoNovia?: string;
    fotoNovio?: string;
    fotoMadreNovia?: string;
    fotoPadreNovia?: string;
    fotoMadreNovio?: string;
    fotoPadreNovio?: string;
  };
  // 👇 CAMBIAR: padrinos ahora es PadrinoAsignado[]
  padrinos: PadrinoAsignado[];
  regalos: { texto: string; links: { nombre: string; url: string }[] };
  confirmacion: { telefono: string; whatsapp: string; link: string };
  hashtag: string;
  consideraciones: string;
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
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './formulario-invitacion.component.html',
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
    historia: '',
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
    dressCode: { descripcion: '', sugerencia: '' },
    padres: {
      padreNovia: '',
      madreNovia: '',
      padreNovio: '',
      madreNovio: '',
      novio: '',
      novia: '',
      fotoNovia: '',
      fotoNovio: '',
      fotoMadreNovia: '',
      fotoPadreNovia: '',
      fotoMadreNovio: '',
      fotoPadreNovio: '',
    },
    padrinos: [], // 👈 Ahora es PadrinoAsignado[]
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
  imagenSubiendo = false;

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
        historia: '',
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
        dressCode: { descripcion: '', sugerencia: '' },
        padres: {
          padreNovia: '',
          madreNovia: '',
          padreNovio: '',
          madreNovio: '',
          novio: '',
          novia: '',
          fotoNovia: '',
          fotoNovio: '',
          fotoMadreNovia: '',
          fotoPadreNovia: '',
          fotoMadreNovio: '',
          fotoPadreNovio: '',
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
}
