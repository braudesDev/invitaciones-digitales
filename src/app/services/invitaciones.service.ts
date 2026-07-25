import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

export interface Invitacion {
  id: string;
  name: string;
  slug: string;
  tipo: 'boda' | 'xv' | 'bautizo' | 'cumples';

  // PRINCIPALES
  descripcion?: string;
  componente?: string;
  nombres?: string;
  fecha: Date;
  lugar?: string;

  // MENSAJES
  frasePrincipal?: string;
  mensajePrincipal?: string;
  fraseDeInvValida?: string;
  mensajePersonalizado?: string;

  // DISEÑO / HERO
  heroImage?: string;
  shareImage?: string;
  photos?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string;
  fontFamily?: string;
  fuente?: string;
  colorTexto?: string;

  // DATOS DEL INVITADO
  invitado?: string;
  pases?: number;

  // INFO ADICIONAL DEL EVENTO
  evento?: string;
  anfitrion?: string;
  anfitrionId?: string; // 👈 NUEVO: ID del usuario dueño
  totalInvitados?: number;
  enviadas?: number;

  // SECCIONES
  padres?: {
    padreNovia?: string;
    madreNovia?: string;
    padreNovio?: string;
    madreNovio?: string;
  };

  ceremonia?: {
    lugar?: string;
    direccion?: string;
    hora?: string;
  };

  recepcion?: {
    lugar?: string;
    direccion?: string;
    hora?: string;
  };

  padrinos?: string[];
  damas?: string[];

  itinerario?: {
    titulo?: string;
    items?: { hora: string; actividad: string }[];
  };

  dressCode?: {
    estilo?: string;
    colores?: string[];
    coloresReservados?: string[];
    titulo?: string;
    descripcion?: string;
    sugerencia?: string;
    notaAdicional?: string;
    imagen?: string; // Si aún lo usas
  };

  historia?: {
    mostrarSeccion: boolean;
    estilo: 'timeline' | 'tarjetas' | 'album' | 'minimalista';
    titulo: string;
    descripcion: string;
    momentos: { fecha: string; descripcion: string; imagen?: string }[];
  };

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

  hashtag?: string;

  contador?: {
    fechaObjetivo: string;
  };

  regalos?: {
    texto?: string;
    links?: { nombre: string; url: string }[];
  };

  consideraciones?: string;

  confirmacion?: {
    telefono?: string;
    whatsapp?: string;
    link?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class InvitacionesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private get coleccion() {
    return collection(this.firestore, 'invitaciones');
  }

  // 🔹 Obtener invitaciones SOLO del anfitrión actual
  getMisInvitaciones(): Observable<Invitacion[]> {
    const user = this.auth.currentUser;
    if (!user) return new Observable();

    const q = query(this.coleccion, where('anfitrionId', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Invitacion[]>;
  }

  // 🔹 Obtener invitación por slug (pública - cualquiera puede ver)
  getInvitacionBySlug(slug: string): Observable<Invitacion | undefined> {
    const ref = collection(this.firestore, 'invitaciones');
    const q = query(ref, where('slug', '==', slug));

    return new Observable((observer) => {
      getDocs(q)
        .then((snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data() as Invitacion;
            observer.next({ ...data, id: snapshot.docs[0].id });
          } else {
            observer.next(undefined);
          }
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // 🔹 Guardar nueva invitación (asigna automáticamente el anfitrionId)
  async guardarInvitacion(invitacion: Invitacion) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const nuevaInvitacion = {
      ...invitacion,
      anfitrionId: user.uid,
      anfitrion: user.email,
    };

    const docRef = await addDoc(this.coleccion, nuevaInvitacion);
    console.log('Invitación guardada con ID:', docRef.id);
    return docRef.id;
  }

  // 🔹 Obtener todas las invitaciones (solo admin)
  getAll(): Observable<Invitacion[]> {
    return collectionData(this.coleccion, { idField: 'id' }) as Observable<
      Invitacion[]
    >;
  }

  // 🔹 Buscar por slug (público)
  async getBySlug(slug: string): Promise<Invitacion | undefined> {
    const snapshot = await getDocs(collection(this.firestore, 'invitaciones'));
    const invitaciones = snapshot.docs.map((doc) => doc.data() as Invitacion);
    return invitaciones.find((inv) => inv.slug === slug);
  }

  // 🔹 Obtener una invitación por ID (verifica que sea del usuario)
  async getInvitacionById(id: string): Promise<Invitacion | undefined> {
    const docRef = doc(this.firestore, `invitaciones/${id}`);
    const docSnap = await getDocs(query(this.coleccion, where('id', '==', id)));
    const data = docSnap.docs[0]?.data() as Invitacion;

    const user = this.auth.currentUser;
    if (data && user && data.anfitrionId !== user.uid) {
      throw new Error('No tienes permiso para ver esta invitación');
    }
    return data;
  }

  // 🔹 Agregar nueva invitación
  async addInvitacion(invitacion: Invitacion): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    invitacion.slug = invitacion.name.toLowerCase().replace(/\s+/g, '-');
    invitacion.anfitrionId = user.uid;

    const docRef = await addDoc(this.coleccion, invitacion);
    return docRef.id;
  }

  // 🔹 Actualizar invitación (solo si es dueño)
  async updateInvitacion(id: string, data: Partial<Invitacion>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const docRef = doc(this.firestore, `invitaciones/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Invitación no encontrada');
    if (docSnap.data()['anfitrionId'] !== user.uid) {
      throw new Error('No tienes permiso para editar esta invitación');
    }

    return updateDoc(docRef, { ...data });
  }

  // 🔹 Eliminar invitación (solo si es dueño)
  async deleteInvitacion(id: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const docRef = doc(this.firestore, `invitaciones/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Invitación no encontrada');
    if (docSnap.data()['anfitrionId'] !== user.uid) {
      throw new Error('No tienes permiso para eliminar esta invitación');
    }

    return deleteDoc(docRef);
  }
}
