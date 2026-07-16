import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { InvitadosService } from '../../services/invitados.service';
import { Invitado } from '../../models/invitado.model';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-anfitrion-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './anfitrion-dashboard.component.html',
  styleUrls: ['./anfitrion-dashboard.component.css'],
})
export class AnfitrionDashboardComponent implements OnInit, OnDestroy {
  tabActivo: 'pendiente' | 'confirmado' | 'rechazado' = 'pendiente';
  invitados$: Observable<Invitado[]> | undefined;
  nuevoInvitado: Partial<Invitado> = {
    nombre: '',
    pases: 1,
    mensajePersonalizado: '',
    estado: 'pendiente',
  };

  eventoSlug = '';
  misEventos: any[] = [];
  userName: string = '';
  userEmail: string = '';
  userPhotoURL: string = '';
  origin = window.location.origin;

  private authSubscription!: Subscription;

  constructor(
    private invitadosService: InvitadosService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
  ) {}

  async cargarUsuario() {
    const user = this.auth.currentUser;
    if (user) {
      this.userEmail = user.email || '';
      this.userPhotoURL = user.photoURL || '';

      if (user.displayName) {
        this.userName = user.displayName;
      } else {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          this.userName =
            data['nombre'] || data['email']?.split('@')[0] || 'Anfitrión';
        } else {
          this.userName = this.userEmail.split('@')[0] || 'Anfitrión';
        }
      }
    }
  }

  ngOnInit() {
    this.cargarUsuario();

    this.authSubscription = authState(this.auth).subscribe((user) => {
      console.log('🔄 Auth state changed:', user?.email, user?.uid);
      if (user) {
        this.cargarUsuario();
        this.cargarMisEventos();
        // 👈 No llamar a cargarInvitados() aquí
      } else {
        // Usuario cerró sesión, limpiar datos
        this.misEventos = [];
        this.eventoSlug = '';
        this.invitados$ = undefined;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  cambiarTab(tab: 'pendiente' | 'confirmado' | 'rechazado') {
    this.tabActivo = tab;
    this.cargarInvitados();
  }

  async cargarMisEventos() {
    const user = this.auth.currentUser;
    console.log('👤 Usuario en cargarMisEventos:', user?.email, user?.uid);

    if (user) {
      const q = query(
        collection(this.firestore, 'invitaciones'),
        where('anfitrionId', '==', user.uid),
      );
      const snapshot = await getDocs(q);
      this.misEventos = snapshot.docs.map((doc) => ({
        slug: doc.id,
        name: doc.data()['name'],
      }));
      console.log(
        '📋 Eventos encontrados para este usuario:',
        this.misEventos.length,
      );

      if (this.misEventos.length > 0) {
        this.eventoSlug = this.misEventos[0].slug;
        this.cargarInvitados();
      } else {
        this.eventoSlug = '';
        this.invitados$ = undefined;
      }
    } else {
      console.log('⚠️ No hay usuario logueado');
    }
  }

  // Agrega este método después de cargarMisEventos()
  async eliminarEvento(eventoSlug: string, eventoName: string) {
    const confirmar = confirm(
      `¿Estás seguro de que quieres eliminar la invitación "${eventoName}"?\n\nEsta acción eliminará TODOS los invitados asociados a este evento. No se puede deshacer.`,
    );

    if (!confirmar) return;

    try {
      // 1. Eliminar todos los invitados de este evento
      const invitadosQuery = query(
        collection(this.firestore, 'invitados'),
        where('eventoSlug', '==', eventoSlug),
      );
      const invitadosSnap = await getDocs(invitadosQuery);

      const deletePromises = invitadosSnap.docs.map((doc) =>
        deleteDoc(doc.ref),
      );
      await Promise.all(deletePromises);

      // 2. Eliminar el evento
      const eventoRef = doc(this.firestore, `invitaciones/${eventoSlug}`);
      await deleteDoc(eventoRef);

      // 3. Recargar la lista de eventos
      await this.cargarMisEventos();

      alert(`✅ Invitación "${eventoName}" eliminada correctamente`);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      alert('❌ Error al eliminar la invitación');
    }
  }

  obtenerNombreEvento(): string {
    const evento = this.misEventos.find((e) => e.slug === this.eventoSlug);
    return evento ? evento.name : 'este evento';
  }

  cargarInvitados() {
    if (!this.eventoSlug) return;
    this.invitados$ = this.invitadosService.getInvitadosPorEvento(
      this.eventoSlug,
      this.tabActivo,
    );
  }

  cambiarEvento() {
    console.log('🔄 Cambiando a evento:', this.eventoSlug);
    this.cargarInvitados();
  }

  generarSlug(nombre: string): string {
    return (
      nombre.toLowerCase().replace(/\s+/g, '-') +
      '-' +
      Math.floor(Math.random() * 10000)
    );
  }

  copiarLink(slug: string) {
    const link = `${window.location.origin}/invitaciones/${slug}`;
    navigator.clipboard.writeText(link);
    alert('✅ Link copiado al portapapeles');
  }

  async agregarInvitado() {
    if (!this.nuevoInvitado.nombre) return;

    const user = this.auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para agregar invitados');
      return;
    }

    if (!this.eventoSlug) {
      alert('Primero crea un evento (invitación)');
      return;
    }

    const invitado: Invitado = {
      id: '',
      nombre: this.nuevoInvitado.nombre!,
      pases: this.nuevoInvitado.pases!,
      mensajePersonalizado: this.nuevoInvitado.mensajePersonalizado || '',
      slug: this.generarSlug(this.nuevoInvitado.nombre!),
      estado: 'pendiente',
      anfitrionId: user.uid,
      eventoSlug: this.eventoSlug,
    };

    await this.invitadosService.agregarInvitado(invitado);

    this.nuevoInvitado = {
      nombre: '',
      pases: 1,
      mensajePersonalizado: '',
      estado: 'pendiente',
    };

    this.cargarInvitados();
  }

  async cambiarEstado(
    inv: Invitado,
    estado: 'pendiente' | 'confirmado' | 'rechazado',
  ) {
    await this.invitadosService.actualizarInvitado(inv.id!, { estado });
    this.cargarInvitados();
  }

  enviarWhatsApp(inv: Invitado) {
    const urlInvitacion = `${window.location.origin}/invitaciones/${inv.slug}`;
    const mensaje = `🎟️ *¡Invitación Especial!*\n\nHola *${inv.nombre}*, te esperamos con *${inv.pases} pases*.\n\n📲 Abre tu invitación aquí:\n${urlInvitacion}\n\n✨ ¡Confirma tu asistencia!`;
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
  }

  descargarPDF(inv: Invitado) {
    alert(`Descargando PDF para ${inv.nombre} (simulado)`);
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
