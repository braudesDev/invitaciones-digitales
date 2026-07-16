import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';

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
  fontFamily: string;
  frasePrincipal?: string;
  mensajePrincipal?: string;
  historia?: string;
  photos: string[];
  anfitrionId?: string;
  ceremonia: { lugar: string; direccion: string; hora: string };
  recepcion: { lugar: string; direccion: string; hora: string };
  dressCode: { descripcion: string; sugerencia: string };
  padres: {
    padreNovia: string;
    madreNovia: string;
    padreNovio: string;
    madreNovio: string;
  };
  padrinos: string[];
  regalos: { texto: string; links: { nombre: string; url: string }[] };
  confirmacion: { telefono: string; whatsapp: string; link: string };
  hashtag: string;
  consideraciones: string;
}

@Component({
  selector: 'app-formulario-invitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-invitacion.component.html',
  styleUrls: ['./formulario-invitacion.component.css'],
})
export class FormularioInvitacionComponent implements OnInit {
  invitacionId: string | null = null;
  cargando = false;
  tabActivo: 'basicos' | 'diseno' | 'mensajes' | 'evento' | 'secciones' =
    'basicos';

  nuevaInvitacion: InvitacionCompleta = {
    name: '',
    slug: '',
    tipo: 'boda',
    nombres: '',
    fecha: new Date().toISOString().substring(0, 16),
    lugar: '',
    heroImage: '',
    primaryColor: '#aef9b3',
    secondaryColor: '#000000',
    fontFamily: "'Playfair Display', serif",
    frasePrincipal: '',
    mensajePrincipal: '',
    historia: '',
    photos: [],
    anfitrionId: '',
    ceremonia: { lugar: '', direccion: '', hora: '' },
    recepcion: { lugar: '', direccion: '', hora: '' },
    dressCode: { descripcion: '', sugerencia: '' },
    padres: { padreNovia: '', madreNovia: '', padreNovio: '', madreNovio: '' },
    padrinos: [],
    regalos: { texto: '', links: [] },
    confirmacion: { telefono: '', whatsapp: '', link: '' },
    hashtag: '',
    consideraciones: '',
  };

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private auth: Auth,
  ) {}

  async ngOnInit() {
    this.invitacionId = this.route.snapshot.paramMap.get('id');
    if (this.invitacionId) {
      this.cargando = true;
      const ref = doc(this.firestore, `invitaciones/${this.invitacionId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Partial<InvitacionCompleta>;
        this.nuevaInvitacion = {
          ...this.nuevaInvitacion,
          ...data,
          photos: data.photos || [], // 👈 FORZAR ARRAY VACÍO
        };
      }
      this.cargando = false;
    }
  }

  agregarPadrino() {
    this.nuevaInvitacion.padrinos.push('');
  }

  eliminarPadrino(index: number) {
    this.nuevaInvitacion.padrinos.splice(index, 1);
  }

  agregarRegaloLink() {
    this.nuevaInvitacion.regalos.links.push({ nombre: '', url: '' });
  }

  eliminarRegaloLink(index: number) {
    this.nuevaInvitacion.regalos.links.splice(index, 1);
  }

  // Agregar foto a la galería
  agregarFoto() {
    if (!this.nuevaInvitacion.photos) {
      this.nuevaInvitacion.photos = [];
    }
    this.nuevaInvitacion.photos.push('');
  }

  // Eliminar foto de la galería
  eliminarFoto(index: number) {
    this.nuevaInvitacion.photos?.splice(index, 1);
  }

  async guardarInvitacion() {
    if (!this.nuevaInvitacion.name || !this.nuevaInvitacion.fecha) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    // 👉 OBTENER USUARIO ACTUAL
    const user = this.auth.currentUser;
    if (!user) {
      Swal.fire(
        'Error',
        'Debes iniciar sesión para guardar la invitación',
        'error',
      );
      return;
    }

    this.nuevaInvitacion.slug = this.nuevaInvitacion.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    // 👉 AGREGAR anfitrionId AL OBJETO A GUARDAR
    const invitacionParaGuardar = {
      ...this.nuevaInvitacion,
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
        primaryColor: '#aef9b3',
        secondaryColor: '#000000',
        fontFamily: "'Playfair Display', serif",
        frasePrincipal: '',
        mensajePrincipal: '',
        historia: '',
        photos: [],
        anfitrionId: '', // 👈 AGREGAR TAMBIÉN AQUÍ
        ceremonia: { lugar: '', direccion: '', hora: '' },
        recepcion: { lugar: '', direccion: '', hora: '' },
        dressCode: { descripcion: '', sugerencia: '' },
        padres: {
          padreNovia: '',
          madreNovia: '',
          padreNovio: '',
          madreNovio: '',
        },
        padrinos: [],
        regalos: { texto: '', links: [] },
        confirmacion: { telefono: '', whatsapp: '', link: '' },
        hashtag: '',
        consideraciones: '',
      };
      this.tabActivo = 'basicos';
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  }
}
