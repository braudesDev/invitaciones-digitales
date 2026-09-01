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
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { Consideraciones } from '../models/consideraciones.model';
import { Confirmacion } from '../models/confirmacion.model';
import { AudioConfig } from '../models/audio.model';

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
  heroImageMovil?: string;
  heroImageEscritorio?: string;
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
  anfitrionId?: string; // ID del usuario dueño
  colaboradores?: string[]; // 👈 AGREGADO: Lista de UIDs de colaboradores
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
    imagen?: string;
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

  galeria?: {
    mostrarSeccion: boolean;
    estilo: 'grid' | 'masonry' | 'carousel' | 'album' | 'slideshow';
    titulo: string;
    descripcion: string;
    fotos: {
      url: string;
      titulo?: string;
      descripcion?: string;
      destacada?: boolean;
    }[];
    efecto: 'slide' | 'fade' | 'zoom' | 'flip';
    velocidad: number;
    mostrarControles: boolean;
    mostrarCompartir: boolean;
    mostrarPaginacion: boolean;
  };

  hashtag?: {
    titulo: string;
    subtitulo: string;
    hashtag: string;
    mensaje: string;
    icono: string;
    mostrarIcono: boolean;
    resaltarHashtag: boolean;
    mostrarCaracteristicas: boolean;
  };

  contador?: {
    fechaObjetivo: string;
  };

  regalos?: {
    texto?: string;
    links?: { nombre: string; url: string }[];
  };

  consideracionesData?: string;

  confirmacion?: {
    telefono?: string;
    whatsapp?: string;
    link?: string;
  };
  confirmacionData?: Confirmacion;
  animacionHero?: string;
  audio?: AudioConfig;
  estiloAOS?: 'clasico' | 'moderno' | 'romantico' | 'minimalista' | 'dinamico';
  animacionesAOS?: boolean;
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

  // 🔹 Obtener invitaciones del anfitrión Y las que tiene como colaborador (Observable)
  getMisInvitaciones(): Observable<Invitacion[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);

    const qAnfitrion = query(
      this.coleccion,
      where('anfitrionId', '==', user.uid),
    );
    const qColaborador = query(
      this.coleccion,
      where('colaboradores', 'array-contains', user.uid),
    );

    const obsAnfitrion = collectionData(qAnfitrion, {
      idField: 'id',
    }) as Observable<Invitacion[]>;
    const obsColaborador = collectionData(qColaborador, {
      idField: 'id',
    }) as Observable<Invitacion[]>;

    return combineLatest([obsAnfitrion, obsColaborador]).pipe(
      map(([anfitrionEvts, colaboradorEvts]) => {
        const mapa = new Map<string, Invitacion>();
        anfitrionEvts.forEach((e) => mapa.set(e.id, e));
        colaboradorEvts.forEach((e) => mapa.set(e.id, e));
        return Array.from(mapa.values());
      }),
    );
  }

  // 🔹 Obtener invitación por slug (pública)
  getInvitacionBySlug(slug: string): Observable<Invitacion | undefined> {
    const q = query(this.coleccion, where('slug', '==', slug));

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

  // 🔹 Guardar nueva invitación
  async guardarInvitacion(invitacion: Invitacion): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const nuevaInvitacion = {
      ...invitacion,
      anfitrionId: user.uid,
      anfitrion: user.email,
      colaboradores: [],
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
    const q = query(this.coleccion, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return undefined;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as Omit<Invitacion, 'id'>;

    return {
      ...data,
      id: docSnap.id,
    };
  }

  // 🔹 Obtener invitación por ID (Verifica si es anfitrión O colaborador)
  async getInvitacionById(id: string): Promise<Invitacion | undefined> {
    const docRef = doc(this.firestore, `invitaciones/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return undefined;

    // 👈 Cambiamos "Invitacion" por "Omit<Invitacion, 'id'>"
    const data = docSnap.data() as Omit<Invitacion, 'id'>;
    const user = this.auth.currentUser;

    if (user) {
      const esAnfitrion = data.anfitrionId === user.uid;
      const esColaborador = (data.colaboradores || []).includes(user.uid);

      if (!esAnfitrion && !esColaborador) {
        throw new Error('No tienes permiso para ver esta invitación');
      }
    }

    return {
      ...data,
      id: docSnap.id, // 👈 Pon el 'id' al final
    };
  }

  // 🔹 Agregar nueva invitación
  async addInvitacion(invitacion: Invitacion): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    invitacion.slug = invitacion.name.toLowerCase().replace(/\s+/g, '-');
    invitacion.anfitrionId = user.uid;
    invitacion.colaboradores = [];

    const docRef = await addDoc(this.coleccion, invitacion);
    return docRef.id;
  }

  // 🔹 Actualizar invitación (ANFITRIÓN Y COLABORADOR PERMITIDOS)
  async updateInvitacion(id: string, data: Partial<Invitacion>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const docRef = doc(this.firestore, `invitaciones/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Invitación no encontrada');

    const currentData = docSnap.data();
    const esAnfitrion = currentData['anfitrionId'] === user.uid;
    const esColaborador = (currentData['colaboradores'] || []).includes(
      user.uid,
    );

    // Permitir actualización si es anfitrión O colaborador
    if (!esAnfitrion && !esColaborador) {
      throw new Error('No tienes permiso para editar esta invitación');
    }

    // 🛡️ PROTECCIÓN: Garantizar que NUNCA se cambie el anfitrión original al editar
    delete data.anfitrionId;
    delete data.anfitrion;

    return updateDoc(docRef, { ...data });
  }

  // 🔹 Eliminar invitación (EXCLUSIVO DEL ANFITRIÓN)
  async deleteInvitacion(id: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const docRef = doc(this.firestore, `invitaciones/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error('Invitación no encontrada');
    if (docSnap.data()['anfitrionId'] !== user.uid) {
      throw new Error('Solo el anfitrión puede eliminar esta invitación');
    }

    return deleteDoc(docRef);
  }

  // ================================================================
  // 🤝 SISTEMA DE COLABORADORES
  // ================================================================

  // 1. Verificar si un usuario es colaborador de un evento
  async esColaborador(eventoSlug: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    try {
      const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
      const eventoSnap = await getDoc(eventoRef);

      if (!eventoSnap.exists()) return false;

      const data = eventoSnap.data();
      const colaboradores = data['colaboradores'] || [];

      return colaboradores.includes(user.uid);
    } catch (error) {
      console.error('Error al verificar colaborador:', error);
      return false;
    }
  }

  // 2. Verificar si es el anfitrión
  async esAnfitrion(eventoSlug: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    try {
      const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
      const eventoSnap = await getDoc(eventoRef);

      if (!eventoSnap.exists()) return false;

      return eventoSnap.data()['anfitrionId'] === user.uid;
    } catch (error) {
      console.error('Error al verificar anfitrión:', error);
      return false;
    }
  }

  // 3. Invitar a un colaborador
  async invitarColaborador(
    eventoSlug: string,
    email: string,
  ): Promise<{ message: string }> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
    const eventoSnap = await getDoc(eventoRef);

    if (!eventoSnap.exists()) {
      throw new Error('El evento no existe');
    }

    if (eventoSnap.data()['anfitrionId'] !== user.uid) {
      throw new Error('Solo el anfitrión puede invitar colaboradores');
    }

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const userSnap = await getDocs(q);

    if (userSnap.empty) {
      throw new Error('El usuario no existe. Debe registrarse primero.');
    }

    const uid = userSnap.docs[0].id;
    const colaboradoresActuales = eventoSnap.data()['colaboradores'] || [];

    if (colaboradoresActuales.includes(uid)) {
      throw new Error('Este usuario ya es colaborador');
    }

    await updateDoc(eventoRef, {
      colaboradores: [...colaboradoresActuales, uid],
    });

    return { message: `✅ ${email} ahora es colaborador del evento` };
  }

  // 4. Quitar un colaborador
  async quitarColaborador(
    eventoSlug: string,
    uid: string,
  ): Promise<{ message: string }> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
    const eventoSnap = await getDoc(eventoRef);

    if (!eventoSnap.exists()) {
      throw new Error('El evento no existe');
    }

    if (eventoSnap.data()['anfitrionId'] !== user.uid) {
      throw new Error('Solo el anfitrión puede quitar colaboradores');
    }

    const colaboradoresActuales = eventoSnap.data()['colaboradores'] || [];
    const nuevosColaboradores = colaboradoresActuales.filter(
      (id: string) => id !== uid,
    );

    await updateDoc(eventoRef, {
      colaboradores: nuevosColaboradores,
    });

    return { message: '✅ Colaborador removido' };
  }

  // 5. Obtener lista de colaboradores con sus datos
  async obtenerColaboradores(eventoSlug: string): Promise<any[]> {
    const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
    const eventoSnap = await getDoc(eventoRef);

    if (!eventoSnap.exists()) return [];

    const colaboradoresIds = eventoSnap.data()['colaboradores'] || [];
    if (colaboradoresIds.length === 0) return [];

    const colaboradores: any[] = [];
    for (const uid of colaboradoresIds) {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        colaboradores.push({
          uid,
          ...userSnap.data(),
        });
      }
    }

    return colaboradores;
  }

  // 6. Obtener eventos donde soy colaborador
  async getEventosColaborador(): Promise<any[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    const eventosRef = collection(this.firestore, 'invitaciones');
    const q = query(
      eventosRef,
      where('colaboradores', 'array-contains', user.uid),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}
