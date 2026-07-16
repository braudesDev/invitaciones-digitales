import {
  collectionData,
  collection,
  query,
  where,
  Firestore,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invitado } from '../models/invitado.model';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class InvitadosService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private getCollection() {
    return collection(this.firestore, 'invitados');
  }

  // 🔹 Obtener invitados del anfitrión actual
  getMisInvitados(estado?: string): Observable<Invitado[]> {
    const user = this.auth.currentUser;
    if (!user) return new Observable();

    const ref = collection(this.firestore, 'invitados');
    const q = estado
      ? query(
          ref,
          where('anfitrionId', '==', user.uid),
          where('estado', '==', estado),
        )
      : query(ref, where('anfitrionId', '==', user.uid));

    return collectionData<any>(q, { idField: 'id' }).pipe(
      map((docs: any[]) =>
        docs.map((doc) => ({
          id: doc.id ?? '',
          nombre: doc.nombre ?? '',
          pases: doc.pases ?? 1,
          mensajePersonalizado: doc.mensajePersonalizado ?? '',
          slug: doc.slug ?? '',
          estado: doc.estado ?? 'pendiente',
          anfitrionId: doc.anfitrionId ?? '',
          eventoSlug: doc.eventoSlug ?? '',
        })),
      ),
    );
  }

  // 🔹 Obtener invitados por evento específico (para el dashboard)
  getInvitadosPorEvento(
    eventoSlug: string,
    estado?: string,
  ): Observable<Invitado[]> {
    const ref = collection(this.firestore, 'invitados');
    const q = estado
      ? query(
          ref,
          where('eventoSlug', '==', eventoSlug),
          where('estado', '==', estado),
        )
      : query(ref, where('eventoSlug', '==', eventoSlug));

    return collectionData<any>(q, { idField: 'id' }).pipe(
      map((docs: any[]) =>
        docs.map((doc) => ({
          id: doc.id ?? '',
          nombre: doc.nombre ?? '',
          pases: doc.pases ?? 1,
          mensajePersonalizado: doc.mensajePersonalizado ?? '',
          slug: doc.slug ?? '',
          estado: doc.estado ?? 'pendiente',
          anfitrionId: doc.anfitrionId ?? '',
          eventoSlug: doc.eventoSlug ?? '',
        })),
      ),
    );
  }

  // 🔹 Obtener invitado por slug (público)
  getInvitadoPorSlug(slug: string): Observable<Invitado | undefined> {
    const ref = collection(this.firestore, 'invitados');
    const q = query(ref, where('slug', '==', slug));
    return collectionData<any>(q, { idField: 'id' }).pipe(
      map((docs: any[]) => {
        if (!docs || !docs.length) return undefined;
        const doc = docs[0];
        return {
          id: doc.id ?? '',
          nombre: doc.nombre ?? '',
          pases: doc.pases ?? 1,
          mensajePersonalizado: doc.mensajePersonalizado ?? '',
          slug: doc.slug ?? '',
          estado: doc.estado ?? 'pendiente',
          anfitrionId: doc.anfitrionId ?? '',
          eventoSlug: doc.eventoSlug ?? '',
        } as Invitado;
      }),
    );
  }

  // 🔹 Agregar invitado
  async agregarInvitado(invitado: Invitado) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const nuevoInvitado = {
      ...invitado,
      anfitrionId: user.uid,
    };
    return addDoc(this.getCollection(), nuevoInvitado);
  }

  // 🔹 Actualizar invitado
  async actualizarInvitado(id: string, data: Partial<Invitado>) {
    const ref = doc(this.firestore, `invitados/${id}`);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) throw new Error('Invitado no encontrado');

    const invitadoData = docSnap.data();
    const user = this.auth.currentUser;

    const soloEstado = Object.keys(data).length === 1 && data.estado;
    const esDueño = user && invitadoData['anfitrionId'] === user.uid;

    if (!esDueño && !soloEstado) {
      throw new Error('No tienes permiso para modificar este invitado');
    }

    return updateDoc(ref, data);
  }

  // 🔹 Eliminar invitado
  async eliminarInvitado(id: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const ref = doc(this.firestore, `invitados/${id}`);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) throw new Error('Invitado no encontrado');
    if (docSnap.data()['anfitrionId'] !== user.uid) {
      throw new Error('No tienes permiso para eliminar este invitado');
    }

    return deleteDoc(ref);
  }
}
